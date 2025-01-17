function GetVariablesFromWeb() {
  var isLowMemory;
  var deviceMemory = navigator.deviceMemory;

  if (deviceMemory <= 4) {
    isLowMemory = 1;
  } else {
    isLowMemory = 0;
  }

  console.log("MEMORY: " + navigator.deviceMemory);
  console.log("isLowMemory: " + isLowMemory);
  // isAssetBundleLoaded = true;

  let jsonValue = {

    token: token,
    version: version,
    gameId: gameId,
    link: apiEndpoint,
    languageCode: lang,
    is1000: is1000,
    hasDecimal : hasFloat
  }

  myGameInstance.SendMessage(
    "[ Callback ]",
    "SetVariablesFromWeb",
    `${JSON.stringify(jsonValue)}`
  );

  isLoadingDone = true;
  ShowStartButton();
}
//LOADING ASSET BUNDLE
function InvokeGetAssetBundleLink() {
  var link = assetBundleLink;

  myGameInstance.SendMessage("[ABL]", "SetAssetBundleLink", `${link}`);
}

function CheckResponseCodeHtml(data) {
  const jsonParsed = JSON.parse(data);
  var message;
  prompt.style.display = "none";
  // InitializeGame();
  switch (jsonParsed.code) {
    case 200:
      //game is up to date
      //message = "Success";
      prompt.style.display = "none";
      prompt.style.opacity = 1;
      initUnityProgressBar(script);

      break;
    case 314:
      console.log("NEW VERSION");
      // InitializeGame();
      prompt.style.display = "block";
      prompt.style.opacity = 1;
      RestartingPage(jsonParsed.msg);
      console.log("data message : " + jsonParsed.msg);
      promptTitle.textContent = "System Message";
      promptmessage.textContent = jsonParsed.msg;
      promptCode.textContent = "(Error code number : " + jsonParsed.code + ")";
      break;
    case 1003:
      prompt.style.display = "block";
      console.log("data message : " + jsonParsed.msg);
      promptTitle.textContent = "System Message";
      promptmessage.textContent = jsonParsed.msg;
      promptErrorCode.textContent = "(Error code number : " + jsonParsed.code + ")"
      break;
    default:
      prompt.style.display = "block";
      prompt.style.opacity = 1;
      promptmessage.textContent = jsonParsed.msg;
      promptTitle.textContent = "System Message";
      promptCode.textContent = "(Error code number : " + jsonParsed.code + ")";
      InvokeBugsnagError("Internal", jsonParsed.code, jsonParsed.msg);
      console.log(">>> Handled Error : " + jsonParsed.msg);
      break;
  }
}

async function getData() {
  //versionText.textContent = "v." + buildVersion;
  // const postData = {
  //   gameId: gameId,
  //   vis: version,
  //   token: token
  // };

  // // console.log("ID", gameId)
  // // console.log("v", version)
  // // console.log("token", token)
  // // Define the fetch options
  // const fetchOptions = {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(postData),
  // };
  // var url = apiEndpoint + verifygame;

  // try {

  //   const response = await fetch(apiEndpoint + verifygame, fetchOptions);
  //   if (!response.ok) {
  //     throw new Error(`HTTP error! status: ${response.status}`);
  //   } else {
  //     const data = await response.json();
  //     const jsonString = JSON.stringify(data);
  //     CheckResponseCode(jsonString);
  //   }
  // } catch (error) {

  //   InvokeBugsnagError("Internal", "1003", "Get Data Error : " + error);

  //   console.error("Error fetching data from API:", error);
  // }

  async function postWithTimeoutAndRetries(
    url,
    fetchOptions,
    timeout = 5000,
    retries = 6
  ) {
    const attemptRequest = async (attempt) => {
      const controller = new AbortController();
      const signal = controller.signal;

      const timeoutId = setTimeout(() => {
        controller.abort();
      }, timeout);

      try {
        const response = await fetch(url, { ...fetchOptions, signal });
        clearTimeout(timeoutId);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      } catch (error) {
        clearTimeout(timeoutId);
        if (attempt < retries && error.name === "AbortError") {
          console.warn(`Attempt ${attempt} failed due to timeout, retrying...`);
          return attemptRequest(attempt + 1);
        }
        throw error;
      }
    };

    return attemptRequest(1);
  }

  const postData = {
    gameId: gameId,
    vis: version,
    token: token,
  };

  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  };

  apiEndpoint = "https://" + env + "/imapi/";

  //const url = apiEndpoint + verifygame;

  try {
    const data = {
      code: 200,
      message: "Success",
    };
    const jsonString = JSON.stringify(data);
    CheckResponseCodeHtml(jsonString);
  } catch (error) {
    const errReturn = {
      code: 500,
      msg: "Error In Connection",
    };
    const jsonString = JSON.stringify(errReturn);
    CheckResponseCodeHtml(jsonString);

    InvokeBugsnagError("Internal", "1003", "Get Data Error : " + error);
    console.error("Error fetching data from API:", error);
  }
}
