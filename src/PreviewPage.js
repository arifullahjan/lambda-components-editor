import {
  createRemoteComponent,
  createRequires,
} from "@paciolan/remote-component";
import React, { useMemo, useReducer, useState } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { resolve } from "./remote-component.config.js";

const requires = createRequires(resolve);

export const RemoteComponent = createRemoteComponent({ requires });

const safeJsonParse = (s) => {
  try {
    return JSON.parse(s);
  } catch (e) {
    return undefined;
  }
};
export const PreviewPage = React.memo(() => {
  const location = useLocation();
  const componentUrl = new URLSearchParams(location.search).get("url");
  const [propsStrinfg, setPropsString] = useState("");
  const [forceUpdated, forceUpdate] = useReducer((x) => x + 1, 0);
  const props = useMemo(() => {
    return safeJsonParse(propsStrinfg);
  }, [propsStrinfg]);
  console.log({ props });
  return (
    <>
      <div className={"shadow rounded m-4"}>
        <RemoteComponent url={componentUrl} {...(props || {})} />
      </div>
      <div className="m-2 text-center">
        <h5>Test Props</h5>

        <textarea
          value={propsStrinfg}
          onChange={(e) => setPropsString(e.target.value)}
          language="json"
          lines="6"
          style={{ height: "175px" }}
          className="w-full shadow"
        ></textarea>
        {propsStrinfg && !props && (
          <>
            <label>Note: make sure JSON is correct</label>
            <br />
          </>
        )}
        {/* <button
          onClick={(e) => {
            forceUpdate();
          }}
          className="m-auto bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 text-sm rounded  m-1 "
        >
          Apply
        </button> */}
      </div>
    </>
  );
});
