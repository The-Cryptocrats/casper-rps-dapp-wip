#![no_std]
#![no_main]

extern crate alloc;
use crate::alloc::string::ToString;
use alloc::boxed::Box;
use alloc::vec;
use alloc::vec::Vec;

use casper_contract::{
    contract_api::{account, runtime, storage, system},
    unwrap_or_revert::UnwrapOrRevert,
};
use casper_types::{
    api_error::ApiError,
    bytesrepr, bytesrepr::FromBytes, bytesrepr::ToBytes, CLType,
    CLTyped, CLValue, EntryPoint, EntryPointAccess, EntryPointType,
    EntryPoints, Parameter, URef, U512,
};

const CONTRACT_PACKAGE_NAME: &str = "rps_package_name";
const CONTRACT_ACCESS_UREF: &str = "rps_access_uref";
const ENTRY_POINT_INIT_GAME: &str = "init_game";
const ENTRY_POINT_SET_WINNER: &str = "set_winner";
const ENTRY_POINT_GET_GAME_DATA: &str = "get_game_data";
const GAME_DATA_KEY: &str = "game_data";
const PLAYER1_PURSE: &str = "player1_purse";
const PLAYER2_PURSE: &str = "player2_purse";
const BET_AMOUNT: &str = "bet_amount";
const WINNER: &str = "winner";

#[derive(Debug, Clone, PartialEq)]
struct GameData {
    player1_purse: URef,
    player2_purse: URef,
    bet_amount: U512,
    winner: Option<u8>,
}

impl CLTyped for GameData {
    fn cl_type() -> CLType {
        CLType::Tuple2([
            Box::new(CLType::Tuple2([
                Box::new(CLType::URef),
                Box::new(CLType::URef),
            ])),
            Box::new(CLType::Tuple2([
                Box::new(CLType::U512),
                Box::new(CLType::Option(Box::new(CLType::U8))),
            ])),
        ])
    }
}

impl ToBytes for GameData {
    fn to_bytes(&self) -> Result<Vec<u8>, bytesrepr::Error> {
        let mut bytes = Vec::new();
        bytes.extend((self.player1_purse, self.player2_purse).to_bytes()?);
        bytes.extend((self.bet_amount, self.winner).to_bytes()?);
        Ok(bytes)
    }

    fn serialized_length(&self) -> usize {
        (self.player1_purse, self.player2_purse).serialized_length()
            + (self.bet_amount, self.winner).serialized_length()
    }
}

impl FromBytes for GameData {
    fn from_bytes(bytes: &[u8]) -> Result<(Self, &[u8]), bytesrepr::Error> {
        let ((player1_purse, player2_purse), rem) = <(URef, URef)>::from_bytes(bytes)?;
        let ((bet_amount, winner), rem) = <(U512, Option<u8>)>::from_bytes(rem)?;
        Ok((
            GameData {
                player1_purse,
                player2_purse,
                bet_amount,
                winner,
            },
            rem,
        ))
    }
}

#[no_mangle]
pub extern "C" fn init_game() {
    let player1_purse: URef = runtime::get_named_arg(PLAYER1_PURSE);
    let player2_purse: URef = runtime::get_named_arg(PLAYER2_PURSE);
    let bet_amount: U512 = runtime::get_named_arg(BET_AMOUNT);

    let game_data = GameData {
        player1_purse,
        player2_purse,
        bet_amount,
        winner: None,
    };

    let game_data_uref = storage::new_uref(game_data);
    runtime::put_key(GAME_DATA_KEY, game_data_uref.into());
}

#[no_mangle]
pub extern "C" fn set_winner() {
    let winner: u8 = runtime::get_named_arg(WINNER);
    let game_data_uref: URef = runtime::get_key(GAME_DATA_KEY)
        .unwrap_or_revert_with(ApiError::MissingKey)
        .into_uref()
        .unwrap_or_revert_with(ApiError::UnexpectedKeyVariant);

    let mut game_data: GameData =
        storage::read(game_data_uref).unwrap_or_revert().unwrap_or_revert();

    game_data.winner = Some(winner);
    storage::write(game_data_uref, game_data.clone());

    if let Some(winner) = game_data.winner {
        match winner {
            0 => {
                // Draw: Refund both players
                refund_players(game_data.player1_purse, game_data.bet_amount);
                refund_players(game_data.player2_purse, game_data.bet_amount);
            }
            1 => {
                // Player 1 wins: Transfer both bets to player 1
                transfer_winnings(
                    game_data.player2_purse,
                    game_data.player1_purse,
                    game_data.bet_amount * 2,
                );
            }
            2 => {
                // Player 2 wins: Transfer both bets to player 2
                transfer_winnings(
                    game_data.player1_purse,
                    game_data.player2_purse,
                    game_data.bet_amount * 2,
                );
            }
            _ => runtime::revert(ApiError::User(1)), // Invalid winner value
        }
    }
}

#[no_mangle]
pub extern "C" fn get_game_data() {
    let game_data_uref: URef = runtime::get_key(GAME_DATA_KEY)
        .unwrap_or_revert_with(ApiError::MissingKey)
        .into_uref()
        .unwrap_or_revert_with(ApiError::UnexpectedKeyVariant);
    let game_data: GameData =
        storage::read(game_data_uref).unwrap_or_revert().unwrap_or_revert();
    let result = CLValue::from_t(game_data).unwrap_or_revert();
    runtime::ret(result);
}

fn refund_players(purse: URef, amount: U512) {
    let main_purse = account::get_main_purse();
    system::transfer_from_purse_to_purse(purse, main_purse, amount, None)
        .unwrap_or_revert_with(ApiError::Transfer);
}

fn transfer_winnings(from_purse: URef, to_purse: URef, amount: U512) {
    system::transfer_from_purse_to_purse(from_purse, to_purse, amount, None)
        .unwrap_or_revert_with(ApiError::Transfer);
}

#[no_mangle]
pub extern "C" fn call() {
    let mut entry_points = EntryPoints::new();

    entry_points.add_entry_point(EntryPoint::new(
        ENTRY_POINT_INIT_GAME,
        vec![
            Parameter::new(PLAYER1_PURSE, CLType::URef),
            Parameter::new(PLAYER2_PURSE, CLType::URef),
            Parameter::new(BET_AMOUNT, CLType::U512),
        ],
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));

    entry_points.add_entry_point(EntryPoint::new(
        ENTRY_POINT_SET_WINNER,
        vec![Parameter::new(WINNER, CLType::U8)],
        CLType::Unit,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));

    entry_points.add_entry_point(EntryPoint::new(
        ENTRY_POINT_GET_GAME_DATA,
        vec![],
        CLType::Result {
            ok: Box::new(CLType::Any),
            err: Box::new(CLType::U32), // Changed from U16 to U32
        },
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));

    let (stored_contract_hash, _) =
        storage::new_contract(entry_points, None, Some(CONTRACT_PACKAGE_NAME.to_string()), Some(CONTRACT_ACCESS_UREF.to_string()));
    runtime::put_key(GAME_DATA_KEY, stored_contract_hash.into());
}
