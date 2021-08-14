export const DescritptorEditor = ({ value, onChange }) => {
  const { id, isGlobal, attributes } = value || {};
  console.log({ value });
  return (
    <>
      <div>
        <div className="">
          <label className="block text-gray-700 text-sm mb-2" for="componentId">
            Unique Component ID
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="componentId"
            type="text"
            placeholder=""
            value={id}
            onChange={(e) => {
              onChange({
                ...value,
                id: e.target.value,
              });
            }}
          />
        </div>
        <div className="p-2"></div>
        <h3>Inputs</h3>
        {Object.entries(value?.attributes || {}).map((attributeInfo, index) => {
          const attributeKey = attributeInfo[0];
          const attributeSettings = attributeInfo[1];
          return (
            <>
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-300 rounded my-2">
                <div>
                  Key
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    placeholder=""
                    value={attributeKey}
                    onChange={(e) => {
                      delete value?.attributes[attributeKey];
                      onChange({
                        ...value,
                        attributes: {
                          ...value.attributes,
                          [e.target.value]: attributeSettings,
                        },
                      });
                    }}
                  />
                </div>
                <div>
                  Label
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    placeholder=""
                    value={attributeSettings.label}
                    onChange={(e) => {
                      onChange({
                        ...value,
                        attributes: {
                          ...value.attributes,
                          [attributeKey]: {
                            ...attributeSettings,
                            label: e.target.value,
                          },
                        },
                      });
                    }}
                  />
                </div>
                <div>
                  <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder=""
                    value={attributeSettings.type}
                    onChange={(e) => {
                      onChange({
                        ...value,
                        attributes: {
                          ...value.attributes,
                          [attributeKey]: {
                            ...attributeSettings,
                            type: e.target.value,
                          },
                        },
                      });
                    }}
                  >
                    <option value="String">String</option>
                    <option value="String">Number</option>
                    <option value="String">Boolean</option>
                  </select>
                </div>
              </div>
            </>
          );
        })}

        <div>
          <button
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  m-2 `}
            onClick={() => {
              onChange({
                ...value,
                attributes: {
                  ...attributes,
                  ["key"]: {
                    label: "Label",
                    type: "String",
                  },
                },
              });
            }}
          >
            + Add Input
          </button>
        </div>
      </div>
    </>
  );
};
