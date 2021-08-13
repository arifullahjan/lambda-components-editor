import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { build, list, saveCode } from "./utils";

const defaultOptions = {
  acceptSuggestionOnCommitCharacter: true,
  acceptSuggestionOnEnter: "on",
  accessibilitySupport: "auto",
  autoIndent: false,
  automaticLayout: true,
  codeLens: true,
  colorDecorators: true,
  contextmenu: true,
  cursorBlinking: "blink",
  cursorSmoothCaretAnimation: false,
  cursorStyle: "line",
  disableLayerHinting: false,
  disableMonospaceOptimizations: false,
  dragAndDrop: false,
  fixedOverflowWidgets: false,
  folding: true,
  foldingStrategy: "auto",
  fontLigatures: false,
  formatOnPaste: false,
  formatOnType: false,
  hideCursorInOverviewRuler: false,
  highlightActiveIndentGuide: true,
  links: true,
  mouseWheelZoom: false,
  multiCursorMergeOverlapping: true,
  multiCursorModifier: "alt",
  overviewRulerBorder: true,
  overviewRulerLanes: 2,
  quickSuggestions: true,
  quickSuggestionsDelay: 100,
  readOnly: false,
  renderControlCharacters: false,
  renderFinalNewline: true,
  renderIndentGuides: true,
  renderLineHighlight: "all",
  renderWhitespace: "none",
  revealHorizontalRightPadding: 30,
  roundedSelection: true,
  rulers: [],
  scrollBeyondLastColumn: 5,
  scrollBeyondLastLine: true,
  selectOnLineNumbers: true,
  selectionClipboard: true,
  selectionHighlight: true,
  showFoldingControls: "mouseover",
  smoothScrolling: false,
  suggestOnTriggerCharacters: true,
  wordBasedSuggestions: true,
  wordSeparators: "~!@#$%^&*()-=+[{]}|;:'\",.<>/?",
  wordWrap: "off",
  wordWrapBreakAfterCharacters: "\t})]?|&,;",
  wordWrapBreakBeforeCharacters: "{([+",
  wordWrapBreakObtrusiveCharacters: ".",
  wordWrapColumn: 80,
  wordWrapMinified: true,
  wrappingIndent: "none",
};
const search = new URLSearchParams(window.location.search);
const componentIdFromUrl = search?.get("componentId");
const accountId = search?.get("accountId");
const sourceFile = search?.get("sourceFile");
const cloudBuildService = search?.get("cloudBuildService");

export const CodeEditor = () => {
  const [sourceCode, setSourceCode] = useState("");
  const [componentId, setComponentId] = useState(componentIdFromUrl);

  // Queries
  const { data: componentList } = useQuery("componentList", () => {
    return list(cloudBuildService, accountId);
  });
  //   // Mutations
  const saveMutation = useMutation(async () => {
    return saveCode(cloudBuildService, accountId, componentId, sourceCode);
  });
  const buildMutation = useMutation(async () => {
    return build(cloudBuildService, accountId, componentId);
  });

  console.log(saveMutation);
  useEffect(async () => {
    try {
      const fileUrl =
        sourceFile ||
        componentList?.find((c) => c.componentId === componentId).sourceUrl;
      console.log({ componentList, fileUrl });
      const code = await fetch(fileUrl).then((response) => response.text());
      setSourceCode(code);
    } catch (e) {
      console.error(e);
    }
  }, [componentList]);

  return (
    <>
      <div className="flex p-4 justify-between items-center">
        <div className="text-left">
          <h2 className="text-lg">{"⚒️ 🧰 ⚒️ Lambda componet editor"}</h2>
          <p className="text-sm">
            Code react component online in browser from anywhere, build and
            store on cloud and consume in your storefront.
          </p>
          <p>
            All Components:{" "}
            {componentList?.map((component) => {
              return (
                <>
                  <a
                    className="text-blue-700 font-bold"
                    href={`?accountId=${accountId}&cloudBuildService=${cloudBuildService}&componentId=${component.componentId}`}
                  >
                    {component.componentId}
                  </a>
                </>
              );
            })}
          </p>
          <div className="">
            <label
              className="block text-gray-700 text-sm mb-2"
              for="componentId"
            >
              Unique Component ID
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="componentId"
              type="text"
              placeholder=""
              value={componentId}
              onChange={(e) => {
                setComponentId(e.target.value);
              }}
            />
          </div>
        </div>

        <div>
          <button
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  m-2 `}
            onClick={() => saveMutation.mutate({})}
          >
            Save
          </button>
          <button
            disabled={true}
            className={`bg-blue-200  text-white font-bold py-2 px-4 rounded  m-2 `}
          >
            Run
          </button>
          <button
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  m-2`}
            onClick={() => buildMutation.mutate({})}
          >
            Build
          </button>
        </div>
      </div>
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue={`
export default Component = ({
  title,
  description
}) => {
  return (
    <>
      <h1>{title}</h1>
      <p>{description}</p>
    </>
  )
}

Component.descriptor = Types.Component({
  attributes: {
    title: Types.String({ lable: 'Title' }),
    description: Types.String({ lable: 'Description' })
  }
})      
      `}
        value={sourceCode}
        onChange={(value) => setSourceCode(value)}
        {...defaultOptions}
      />
    </>
  );
};
