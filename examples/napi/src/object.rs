use napi::{bindgen_prelude::*, JsGlobal, JsNull, JsUndefined};

#[napi]
fn list_obj_keys(obj: Object) -> Vec<String> {
  Object::keys(&obj).unwrap()
}

#[napi]
fn create_obj(env: Env) -> Object {
  let mut obj = env.create_object().unwrap();
  obj.set("test", 1).unwrap();

  obj
}

#[napi]
fn get_global(env: Env) -> Result<JsGlobal> {
  env.get_global()
}

#[napi]
fn get_undefined(env: Env) -> Result<JsUndefined> {
  env.get_undefined()
}

#[napi]
fn get_null(env: Env) -> Result<JsNull> {
  env.get_null()
}

#[napi(object)]
struct AllOptionalObject {
  pub name: Option<String>,
  pub age: Option<u32>,
}

#[napi]
fn receive_all_optional_object(obj: Option<AllOptionalObject>) -> Result<()> {
  if !obj.is_none() {
    assert!(obj.as_ref().unwrap().name.is_none());
    assert!(obj.as_ref().unwrap().age.is_none());
  }
  Ok(())
}
