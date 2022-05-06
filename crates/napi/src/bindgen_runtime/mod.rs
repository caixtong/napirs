use std::ffi::c_void;
use std::mem;
use std::rc::Rc;

pub use callback_info::*;
pub use ctor::ctor;
pub use env::*;
pub use iterator::Generator;
pub use js_values::*;
pub use module_register::*;

use super::sys;
use crate::Status;

mod callback_info;
mod env;
mod error;
pub mod iterator;
mod js_values;
mod module_register;

/// # Safety
///
/// called when node wrapper objects destroyed
#[doc(hidden)]
pub unsafe extern "C" fn raw_finalize_unchecked<T>(
  env: sys::napi_env,
  finalize_data: *mut c_void,
  _finalize_hint: *mut c_void,
) {
  unsafe { Box::from_raw(finalize_data as *mut T) };
  if let Some((_, ref_val, finalize_callbacks_ptr)) =
    REFERENCE_MAP.with(|reference_map| reference_map.borrow_mut().remove(&finalize_data))
  {
    let finalize_callbacks_rc = unsafe { Rc::from_raw(finalize_callbacks_ptr) };

    #[cfg(debug_assertions)]
    {
      let rc_strong_count = Rc::strong_count(&finalize_callbacks_rc);
      let rc_weak_count = Rc::weak_count(&finalize_callbacks_rc);
      // If `Rc` strong count is 2, it means the finalize of referenced `Object` is called before the `fn drop` of the `Reference`
      // It always happened on exiting process
      // In general, the `fn drop` would happen first
      assert!(
        rc_strong_count == 1 || rc_strong_count == 2,
        "Rc strong count is: {}, it should be 1 or 2",
        rc_strong_count
      );
      assert!(
        rc_weak_count == 0,
        "Rc weak count is: {}, it should be 0",
        rc_weak_count
      );
    }
    let finalize = unsafe { Box::from_raw(finalize_callbacks_rc.get()) };
    finalize();
    let delete_reference_status = unsafe { sys::napi_delete_reference(env, ref_val) };
    debug_assert!(
      delete_reference_status == sys::Status::napi_ok,
      "Delete reference in finalize callback failed {}",
      Status::from(delete_reference_status)
    );
  }
}

/// # Safety
///
/// called when node buffer is ready for gc
#[doc(hidden)]
pub unsafe extern "C" fn drop_buffer(
  _env: sys::napi_env,
  finalize_data: *mut c_void,
  finalize_hint: *mut c_void,
) {
  let length_ptr = finalize_hint as *mut (usize, usize);
  #[cfg(debug_assertions)]
  {
    js_values::BUFFER_DATA.with(|buffer_data| {
      let mut buffer = buffer_data.lock().expect("Unlock Buffer data failed");
      buffer.remove(&(finalize_data as *mut u8));
    });
  }
  unsafe {
    let (length, cap) = *Box::from_raw(length_ptr);
    mem::drop(Vec::from_raw_parts(finalize_data as *mut u8, length, cap));
  }
}
