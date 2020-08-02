use std::convert::TryInto;

use napi::{CallContext, JsFunction, JsNumber, JsObject, JsUndefined, Property, Result};

#[js_function(1)]
pub fn create_test_class(ctx: CallContext) -> Result<JsFunction> {
  let add_count_method = Property::new("addCount").with_method(add_count);
  let properties = vec![add_count_method];
  ctx
    .env
    .define_class("TestClass", test_class_constructor, properties)
}

#[js_function(1)]
pub fn test_class_constructor(mut ctx: CallContext<JsObject>) -> Result<JsUndefined> {
  let count = ctx.get::<JsNumber>(0)?;
  ctx
    .this
    .set_named_property("count", ctx.env.create_int32(count.try_into()?)?)?;
  ctx.env.get_undefined()
}

#[js_function(1)]
pub fn add_count(mut ctx: CallContext<JsObject>) -> Result<JsUndefined> {
  let add: i32 = ctx.get::<JsNumber>(0)?.try_into()?;
  let count: i32 = ctx
    .this
    .get_named_property::<JsNumber>("count")?
    .try_into()?;
  ctx
    .this
    .set_named_property("count", ctx.env.create_int32(count + add)?)?;
  ctx.env.get_undefined()
}
