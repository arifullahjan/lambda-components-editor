import React, { useMemo, useReducer, useState } from "react";

export const Preview = React.memo(({ url }) => {
  const [reloaded, reload] = useReducer((x) => x + 1, 0);
  const iframeSrc = useMemo(() => {
    return `/lambda-components-editor/preview?url=${encodeURIComponent(url)}`;
  }, [reloaded, url]);
  return (
    <>
      <button
        onClick={(e) => reload()}
        className="m-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  m-2 "
      >
        Reload
      </button>
      {url && (
        <iframe
          style={{ height: "90vh", width: "100%" }}
          src={iframeSrc}
          key={reloaded}
        />
      )}
    </>
  );
});
