use std::thread;

use napi::{
  bindgen_prelude::*,
  threadsafe_function::{ThreadSafeCallContext, ThreadsafeFunctionCallMode},
};

#[napi]
pub fn call_threadsafe_function(callback: JsFunction) -> Result<()> {
  let tsfn = callback.create_threadsafe_function(0, |ctx: ThreadSafeCallContext<u32>| {
    ctx.env.create_uint32(ctx.value + 1).map(|v| vec![v])
  })?;
  for n in 0..100 {
    let tsfn = tsfn.clone();
    thread::spawn(move || {
      tsfn.call(Ok(n), ThreadsafeFunctionCallMode::Blocking);
    });
  }
  Ok(())
}

#[napi]
pub fn threadsafe_function_throw_error(cb: JsFunction) -> Result<()> {
  let tsfn = cb.create_threadsafe_function(0, |ctx: ThreadSafeCallContext<bool>| {
    ctx.env.get_boolean(ctx.value).map(|v| vec![v])
  })?;
  thread::spawn(move || {
    tsfn.call(
      Err(Error::new(
        Status::GenericFailure,
        "ThrowFromNative".to_owned(),
      )),
      ThreadsafeFunctionCallMode::Blocking,
    );
  });
  Ok(())
}
