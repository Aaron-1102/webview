var isLoadingDone = false;

function fadeOutElement() {
  // landingPage.style.opacity = "0";
}

const initUnityProgressBar = createProgressBarHandler();
//percentageSpan

function ShowStartButton() {
  // progressBarFull.style.width = "100%";
  //res.innerHTML = "[ Completed ]";
  // landingPage.style.display = "none";
  defaultPercentage = 100;

  clearInterval(IntervalId);
  IntervalId = null;

  startOrDownloading.setAttribute(
    'src',
    './TemplateData/NewLoadingAssets/complete.png'
  );

  container.style.transform = `translateX(-${100 - defaultPercentage}%)`;
  bubble.style.left = `${defaultPercentage}%`;
  percentage.innerHTML = `${defaultPercentage}%`;
  
  setTimeout(() => {
    //startOrDownloading.style.display = "block";
    //loader.style.display = "none";
    //third.style.display = "none"
    //last.style.display = "block"
    startOrDownloading.setAttribute(
      'src',
      './TemplateData/NewLoadingAssets/startGame.png'
    );

    startOrDownloading.style.opacity = "0";

    startOrDownloading.classList.add('startGameBtn');

    
      loadingWrapper.style.display = 'none';
      bubble.style.display = 'none';
      pinLoader.style.display = 'none';
    setTimeout(() => {
      
    startOrDownloading.style.opacity = "100";
    startOrDownloading.addEventListener('click', () => {
      //console.log('Start Game');
      StartGame();
      //console.log("Running?");
    });
    }, 500);
  }, 1000);

  //background.style.display = "block";
}

function StartGame() {
  loadingScreen.style.display = 'none';
  myGameInstance.SendMessage('[ Callback ]', 'GetStarted', '');
  gameCanvas.style.display = 'block';
}

function UpdateLoadingProgresBar(progress) {
  const percentageBar = Math.round(progress * 100);

  if (progress < 0.9) {
    defaultPercentage = 20;
  } else {
    //if (!decompressionDone) {
    // Once we reach loading progress of 90%, we assume decompression starts.
    defaultPercentage = 90;
  }

  container.style.transform = `translateX(-${100 - defaultPercentage}%)`;
  bubble.style.left = `${defaultPercentage}%`;
  percentage.innerHTML = `${defaultPercentage}%`;
}

function createProgressBarHandler() {
  let isCounting = false;
  let Counted = false;
  let wasmProgress = 0; // Variable to track WASM download progress

  const getRandomInterval = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const handleProgress = (progress) => {
      const width = Math.round(progress * 100);

      if (width <= 10 && width >= 0) {
          defaultPercentage = 10;
      } else if (width > 10 && width < 40) {
          wasmProgress = width; // Track WASM download progress
          defaultPercentage = 10 + wasmProgress; // Adjust based on WASM progress
      } else if (width >= 40) {
          clearInterval(IntervalId);
          IntervalId = null;
          defaultPercentage = 50; // Adjust as needed
          //FakeLoading();
      }

      container.style.transform = `translateX(-${100 - defaultPercentage}%)`;
      bubble.style.left = `${defaultPercentage}%`;
      percentage.innerHTML = `${defaultPercentage}%`;

    // let current = 100 * progress;

    // if (current < 89 && !isCounting && !Counted) {
    //   isCounting = true;
    //   let dummy = 10;
    //   let count = 71 - dummy;
    //   let i = 0;

    //   intervalId = setInterval(() => {
    //     if (i >= count) {
    //       clearInterval(intervalId); // Stop the interval when reaching the end
    //       isCounting = false;
    //       Counted = true;
    //       //console.log(">>> DONE");
    //       return;
    //     }
    //     let width = i + dummy + "%";
    //     progressBarFull.style.width = width;
    //     //percentageSpan.textContent = i + dummy;

    //     i += getRandomInterval(1, 7); // Increment the counter
    //   }, getRandomInterval(1500, 5000));
    // }

    // if (current > 90 && Counted) {
    //   Counted = false;
    //   progressBarFull.style.width = "70%";
    //   //percentageSpan.textContent = "70";
    // }
  };

  const initializeUnity = (canvas, config) => {
    createUnityInstance(canvas, config, handleProgress)
      .then((unityInstance) => {
        myGameInstance = unityInstance;

        //progressBarFull.style.width = "30%";
        //percentageSpan.textContent = "30";
        //clearInterval(IntervalId);
        //ProceedCount();
      })
      .catch((message) => {
        InvokeBugsnagError(
          'Internal',
          '1004',
          'Unity Initialization Error : ' + message
        );
        alert(message);
      });
  };

  return function (script) {
    script.onload = () => {
      initializeUnity(canvas, config);
    };

    document.body.appendChild(script);
  };
}

///introPanel.style.display = "block";
// connecting.style.display = "block";
// connected.style.display = "none";

function InvokeUpdateLoadingProgress(value) {
  if (value < 1) {
    defaultPercentage = Math.round(50 + (value * 40));
  } else{
    defaultPercentage = 90;

    //ShowStartButton();
    //FakeLoading();
  }

  container.style.transform = `translateX(-${100 - defaultPercentage}%)`;
  bubble.style.left = `${defaultPercentage}%`;
  percentage.innerHTML = `${defaultPercentage}%`;
}

// function FakeLoading()
// {
//   startOrDownloading.setAttribute(
//     'src',
//     './TemplateData/NewLoadingAssets/decompress.png'
//   );
//   if(!isLoadingDone && defaultPercentage < 99)
//     {
//       if (!IntervalId) {
//         IntervalId = setInterval(() => {
//           defaultPercentage += 1;

//           container.style.transform = `translateX(-${100 - defaultPercentage}%)`;
//           bubble.style.left = `${defaultPercentage}%`;
//           percentage.innerHTML = `${defaultPercentage}%`;

//         }, 2000);
//       }
//     }
// }

window.onerror = function (message, source, lineno, colno, error) {
  // Handle the error gracefully
  console.log("Custom Error Handler: ", message);

  // Prevent the default browser alert
  return true;
};


// connectivity-check.js

function checkInternetConnection(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://www.google.com", true);
    xhr.timeout = 5000; // Set a timeout for the request

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            callback(true); // Connection is available
        } else {
            callback(false); // Connection is not available
        }
    };

    xhr.onerror = function () {
        callback(false); // Error occurred, no connection
    };

    xhr.ontimeout = function () {
        callback(false); // Timeout occurred, no connection
    };

    xhr.send();
}

// Function to call from Unity
function checkConnectionFromUnity(callback) {
    checkInternetConnection(callback);
}
