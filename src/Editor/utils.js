// Example POST method implementation:
async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
export const saveCode = async (
  cloudBuildService,
  accountId,
  componentId,
  sourceCode
) => {
  console.log(
    "saveCode",
    cloudBuildService,
    accountId,
    componentId,
    sourceCode
  );
  return postData(`${cloudBuildService}/save`, {
    accountId,
    componentId,
    sourceCode,
  });
};

export const build = async (cloudBuildService, accountId, componentId) => {
  return postData(`${cloudBuildService}/build`, {
    accountId,
    componentId,
  });
};

export const list = async (cloudBuildService, accountId) => {
  return fetch(`${cloudBuildService}/list?accountId=${accountId}`).then((res) =>
    res.json()
  );
};
