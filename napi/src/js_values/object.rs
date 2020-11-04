use super::Value;
#[cfg(napi6)]
use crate::sys;
use crate::{Error, Result, Status};
use std::convert::TryFrom;

#[repr(transparent)]
#[derive(Debug)]
pub struct JsObject(pub(crate) Value);

#[cfg(napi6)]
pub enum KeyCollectionMode {
  IncludePrototypes,
  OwnOnly,
}

#[cfg(napi6)]
impl TryFrom<sys::napi_key_collection_mode> for KeyCollectionMode {
  type Error = Error;

  fn try_from(value: sys::napi_key_collection_mode) -> Result<Self> {
    match value {
      sys::napi_key_collection_mode::napi_key_include_prototypes => Ok(Self::IncludePrototypes),
      sys::napi_key_collection_mode::napi_key_own_only => Ok(Self::OwnOnly),
      _ => Err(Error::from_status(Status::Unknown)),
    }
  }
}

#[cfg(napi6)]
impl From<KeyCollectionMode> for sys::napi_key_collection_mode {
  fn from(value: KeyCollectionMode) -> Self {
    match value {
      KeyCollectionMode::IncludePrototypes => {
        sys::napi_key_collection_mode::napi_key_include_prototypes
      }
      KeyCollectionMode::OwnOnly => sys::napi_key_collection_mode::napi_key_own_only,
    }
  }
}

#[cfg(napi6)]
pub enum KeyFilter {
  AllProperties,
  Writable,
  Enumerable,
  Configurable,
  SkipStrings,
  SkipSymbols,
}

#[cfg(napi6)]
impl TryFrom<sys::napi_key_filter> for KeyFilter {
  type Error = Error;

  fn try_from(value: sys::napi_key_filter) -> Result<Self> {
    match value {
      sys::napi_key_filter::napi_key_all_properties => Ok(Self::AllProperties),
      sys::napi_key_filter::napi_key_writable => Ok(Self::Writable),
      sys::napi_key_filter::napi_key_enumerable => Ok(Self::Enumerable),
      sys::napi_key_filter::napi_key_configurable => Ok(Self::Configurable),
      sys::napi_key_filter::napi_key_skip_strings => Ok(Self::SkipStrings),
      sys::napi_key_filter::napi_key_skip_symbols => Ok(Self::SkipSymbols),
      _ => Err(Error::from_status(Status::Unknown)),
    }
  }
}

#[cfg(napi6)]
impl From<KeyFilter> for sys::napi_key_filter {
  fn from(value: KeyFilter) -> Self {
    match value {
      KeyFilter::AllProperties => Self::napi_key_all_properties,
      KeyFilter::Writable => Self::napi_key_writable,
      KeyFilter::Enumerable => Self::napi_key_enumerable,
      KeyFilter::Configurable => Self::napi_key_configurable,
      KeyFilter::SkipStrings => Self::napi_key_skip_strings,
      KeyFilter::SkipSymbols => Self::napi_key_skip_symbols,
    }
  }
}

#[cfg(napi6)]
pub enum KeyConversion {
  KeepNumbers,
  NumbersToStrings,
}

#[cfg(napi6)]
impl TryFrom<sys::napi_key_conversion> for KeyConversion {
  type Error = Error;

  fn try_from(value: sys::napi_key_conversion) -> Result<Self> {
    match value {
      sys::napi_key_conversion::napi_key_keep_numbers => Ok(Self::KeepNumbers),
      sys::napi_key_conversion::napi_key_numbers_to_strings => Ok(Self::NumbersToStrings),
      _ => Err(Error::from_status(Status::Unknown)),
    }
  }
}

#[cfg(napi6)]
impl From<KeyConversion> for sys::napi_key_conversion {
  fn from(value: KeyConversion) -> Self {
    match value {
      KeyConversion::KeepNumbers => Self::napi_key_keep_numbers,
      KeyConversion::NumbersToStrings => Self::napi_key_numbers_to_strings,
    }
  }
}
