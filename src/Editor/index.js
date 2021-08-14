import Editor from "@monaco-editor/react";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { DescritptorEditor } from "./DescriptorEditor";
import { Preview } from "./Preview";
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
  theme: "vs-dark",
};
const search = new URLSearchParams(window.location.search);
const componentIdFromUrl = search?.get("componentId");
const accountId = search?.get("accountId");
const sourceFile = search?.get("sourceFile");
const cloudBuildService = search?.get("cloudBuildService");

export const CodeEditor = () => {
  const [sourceCode, setSourceCode] = useState("");
  const [componentId, setComponentId] = useState(componentIdFromUrl);
  const [updatedDescriptor, setUpdatedDescriptor] = useState({});

  // Queries
  const { data: componentList } = useQuery("componentList", () => {
    return list(cloudBuildService, accountId);
  });

  const componentInfo = useMemo(() => {
    return componentList?.find((c) => c.componentId === componentId) || {};
  }, [componentList]);
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
      setUpdatedDescriptor(componentInfo?.descriptor || {});
      const fileUrl = sourceFile || componentInfo.sourceUrl;
      console.log({ componentList, fileUrl });
      const code = await fetch(fileUrl).then((response) => response.text());
      setSourceCode(code);
    } catch (e) {
      console.error(e);
    }
  }, [componentInfo]);

  return (
    <>
      <div className="p-4  items-center">
        <div className="text-center w-full">
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
        </div>
      </div>

      <div className="grid grid-cols-layout">
        <div className="">
          <div className="p-2">
            <DescritptorEditor
              value={updatedDescriptor}
              onChange={(updateValue) => {
                setUpdatedDescriptor(updateValue);
                setComponentId(updateValue.id);
              }}
            />
          </div>

          <div>
            <button
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  m-2 `}
              onClick={() => saveMutation.mutate({})}
            >
              {saveMutation.isLoading ? "Saving..." : "Save"}
            </button>
            <button
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  m-2`}
              onClick={() => buildMutation.mutate({})}
            >
              {buildMutation.isLoading ? "Building..." : "Build"}
            </button>
          </div>
        </div>

        <div className="rounded-lg overflow-hidden">
          <Editor
            height="90vh"
            defaultLanguage="javascript"
            defaultValue={`
import React from "react";

const defaultProps = {
  title: 'Hello',
  description: 'World'
}
const RemoteComponent = ({
  title,
  description
} = defaultProps) => {
  return (
    <>
      😎 
      <h1>{title}</h1>
      <p>{description}</p>
    </>
  )
}

export default RemoteComponent;   
      `}
            value={sourceCode}
            onChange={(value) => setSourceCode(value)}
            {...defaultOptions}
          />
        </div>
        <div>
          <h3>Preview</h3>

          {componentInfo ? <Preview url={componentInfo?.compiledUrl} /> : "..."}
        </div>
      </div>
    </>
  );
};
