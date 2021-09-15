# %%
import json
from inference_schema.schema_decorators import input_schema, output_schema
from inference_schema.parameter_types.standard_py_parameter_type import StandardPythonParameterType

# %%
def init():
    print("This is init")



# %%
@input_schema('data', StandardPythonParameterType('input data'))
@output_schema(StandardPythonParameterType('test is inputdata'))
def run(data):
    test = json.loads(data)
    print(f"received data {test}")
    return f"test is {test}"


# %%
from  inference_schema import schema_util

# %%
schema_util.get_input_schema(run)
# %%
schema_util.get_output_schema(run)
# %%
schema_util.get_schemas_dict()
# %%
schema_util.is_schema_decorated(run)
# %%
