// ================================================
//                    流程
// ================================================
// window.onload
// => initVConsole
// => initContent
// => initLiff
//   => initApp  
//     => registerButtonHandlers

// ================================================

var liffId = "2002370517-XKw42Owm",
  params = location.search.substring(1),        //location.search 返回 URL （?）後的參數部分，包含 (?) 本身   => substring(1) 去掉 (?)
  url = window.location.href;

if (params)
  try {
    params = JSON.parse(
      '{"' + decodeURI(params.replace(/&/g, '","').replace(/=/g, '":"')) + '"}'
    );
  } catch (a) {
    getParameterByName = getParameterByNameV2;
  }

//當頁面載入完成後
window.onload = function () {
  initVConsole(), initContent(), initLiff(liffId);
};

var HttpClient = function () {
  this.get = function (a, b) {
    var c = new XMLHttpRequest();
    (c.onreadystatechange = function () {
      4 == c.readyState && 200 == c.status && b(c.responseText);
    }),
      c.open("GET", a, !0),
      c.send(null);
  };
};

function initVConsole() {
  window.vConsole = new window.VConsole({
    defaultPlugins: ["system", "network", "element", "storage"],
    maxLogNumber: 1e3,
    onReady: function () {
      console.log("vConsole is ready.");
    },
    onClearLog: function () {},
  });
}

function initLiff(a) {
  console.log("Going to initialize LIFF to", a),
    liff
      .init({ liffId: a })
      .then(() => {
        "liffToken" == getParameterByName("type") && getLiffToken(),
          "yes" == getParameterByName("auto") &&
            getParameterByName("type") &&
            sendLiffMessage(),
          initApp();
          console.log("LIFF initialized!")
      })
      .catch((a) => {
        console.error("LIFF initialization failed", a);
      });
}

function initApp() {
  if ((!liff.isLoggedIn())) {   //登入按鈕  
    var a = document.getElementById("liffSendMessage");
    (a.innerHTML = "登入"), (a.id = "liffLogin");
  } else {
    if (!liff.isInClient() && void 0 !== getParameterByName("type")) {      //如果使用手機端App是無法登出的
      var b = document.getElementById("content"),
        c = document.createElement("a");
        (c.href = "#"),
        (c.id = "liffLogout"),
        (c.className = "btn btn-lg btn-danger btn-block"),
        (c.innerHTML = "登出"),
        b.insertBefore(c, b.childNodes[6]);
    }
    liff
      .getProfile()
      .then((a) => {
        const b = a.displayName;
        console.info("User name is", b),
          (document.getElementById("greet").innerHTML = "你好, " + b );
      })
      .catch((a) => {
        console.error("LIFF getProfile failed", a);
      });
  }
  registerButtonHandlers();
}

function registerButtonHandlers() {
  (sendMessageButton = document.getElementById("liffSendMessage")),
  (loginButton = document.getElementById("liffLogin")),
  (logoutButton = document.getElementById("liffLogout")),
  sendMessageButton && liff.isInClient()
    ? sendMessageButton.addEventListener("click", sendLiffMessage, !1)
    : sendMessageButton && !liff.isInClient()
      ? logoutButton.addEventListener("click", logoutLiff, !1)
      : loginButton.addEventListener("click", loginLiff, !1);
}

function changeType() {
  var a = document.getElementById("type").value;
  removeElements("form-label-group"), initContent(a);     //輸入欄位重新生成
}

function initContent(a) {
  var b = !0,
    c = document.createElement("div"),
    d = document.createElement("input"),
    e = document.createElement("label"),
    f = document.createElement("textarea");

  a ||
  (
    (a = getParameterByName("type")),
    a && (document.getElementById("type").value = a),
    0 >= document.getElementById("type").selectedIndex && (document.getElementById("type").value = "choose"),
    (b = !1)
  ),
  "yes" == getParameterByName("share") && (document.getElementById("share").checked = !0),
  getParameterByName("liffId") && (liffId = getParameterByName("liffId"));

  var g = document.getElementById("content");

  "text" == a
    ? ((c.className = "form-label-group"),
      (c.id = "data"),
      (d.type = "text"),
      (d.id = "text"),
      (d.className = "form-control"),
      (d.placeholder = "Text message"),
      (d.required = !0),
      getParameterByName("text") && (d.value = getParameterByName("text")),
      (e.htmlFor = "text"),
      (e.innerHTML = "文字訊息"),
      c.appendChild(d),
      c.appendChild(e),
      g.insertBefore(c, g.childNodes[4]))
    : "sticker" == a || "stickerimage" == a
    ? ((c.className = "form-label-group"),
      (c.id = "data"),
      (d.type = "text"),
      (d.id = "packageId"),
      (d.className = "form-control"),
      (d.placeholder = "Text message"),
      (d.required = !0),
      getParameterByName("packageId") &&
        (d.value = getParameterByName("packageId")),
      (e.htmlFor = "packageId"),
      (e.innerHTML = "貼圖包編號"),
      c.appendChild(d),
      c.appendChild(e),
      g.insertBefore(c, g.childNodes[4]),
      (c = document.createElement("div")),
      (d = document.createElement("input")),
      (e = document.createElement("label")),
      (c.className = "form-label-group"),
      (c.id = "data"),
      (d.type = "text"),
      (d.id = "stickerId"),
      (d.className = "form-control"),
      (d.placeholder = "Preview image url"),
      (d.required = !0),
      getParameterByName("stickerId") &&
        (d.value = getParameterByName("stickerId")),
      (e.htmlFor = "stickerId"),
      (e.innerHTML = "貼圖編號"),
      c.appendChild(d),
      c.appendChild(e),
      g.insertBefore(c, g.childNodes[4]),
      (c = document.createElement("div")),
      (checkbox = document.createElement("div")),
      (d = document.createElement("input")),
      (e = document.createElement("label")),
      (checkbox.className = "form-label-group"),
      (checkbox.id = "data"),
      (c.className = "custom-control custom-checkbox"),
      (d.type = "checkbox"),
      (d.id = "animation"),
      (d.className = "custom-control-input"),
      "yes" == getParameterByName("animation") && (d.checked = !0),
      (e.htmlFor = "animation"),
      (e.className = "custom-control-label"),
      (e.innerHTML = "動態貼圖"),
      c.appendChild(d),
      c.appendChild(e),
      checkbox.appendChild(c),
      g.insertBefore(checkbox, g.childNodes[4]))
    : "image" == a || "video" == a
    ? ((c.className = "form-label-group"),
      (c.id = "data"),
      (d.type = "text"),
      (d.id = "downloadUrl"),
      (d.className = "form-control"),
      (d.placeholder = "Original content url"),
      (d.required = !0),
      getParameterByName("downloadUrl") &&
        (d.value = getParameterByName("downloadUrl")),
      (e.htmlFor = "downloadUrl"),
      (e.innerHTML = "下載網址"),
      c.appendChild(d),
      c.appendChild(e),
      g.insertBefore(c, g.childNodes[4]),
      (c = document.createElement("div")),
      (d = document.createElement("input")),
      (e = document.createElement("label")),
      (c.className = "form-label-group"),
      (c.id = "data"),
      (d.type = "text"),
      (d.id = "previewUrl"),
      (d.className = "form-control"),
      (d.placeholder = "Preview image url"),
      (d.required = !0),
      getParameterByName("previewUrl") &&
        (d.value = getParameterByName("previewUrl")),
      (e.htmlFor = "previewUrl"),
      (e.innerHTML = "預覽網址"),
      c.appendChild(d),
      c.appendChild(e),
      g.insertBefore(c, g.childNodes[4]))
    : "audio" == a
    ? ((c.className = "form-label-group"),
      (c.id = "data"),
      (d.type = "text"),
      (d.id = "downloadUrl"),
      (d.className = "form-control"),
      (d.placeholder = "Original content url"),
      (d.required = !0),
      getParameterByName("downloadUrl") &&
        (d.value = getParameterByName("downloadUrl")),
      (e.htmlFor = "downloadUrl"),
      (e.innerHTML = "下載網址"),
      c.appendChild(d),
      c.appendChild(e),
      g.insertBefore(c, g.childNodes[4]))
    : "messages" == a
    ? ((c.className = "form-label-group"),
      (c.id = "data"),
      (f.id = "messages"),
      (f.className = "form-control"),
      (f.placeholder = "Messages json"),
      (f.rows = "5"),
      getParameterByName("messages") &&
        (f.value = getParameterByName("messages")),
      c.appendChild(f),
      g.insertBefore(c, g.childNodes[4]))
    : "messagesUrl" == a
    ? ((c.className = "form-label-group"),
      (c.id = "data"),
      (d.type = "text"),
      (d.id = "messagesUrl"),
      (d.className = "form-control"),
      (d.placeholder = "Messages json url"),
      (d.required = !0),
      getParameterByName("messagesUrl") &&
        (d.value = getParameterByName("messagesUrl")),
      (e.htmlFor = "messagesUrl"),
      (e.innerHTML = "Messages json url"),
      c.appendChild(d),
      c.appendChild(e),
      g.insertBefore(c, g.childNodes[4]))
    : "scanQr" == a
    ? ((c.className = "form-label-group"),
      (c.id = "data"),
      (d.type = "text"),
      (d.id = "qrResult"),
      (d.className = "form-control"),
      (d.placeholder = "QR Code Result"),
      (d.required = !0),
      (e.htmlFor = "qrResult"),
      (e.innerHTML = "掃描結果"),
      c.appendChild(d),
      c.appendChild(e),
      g.insertBefore(c, g.childNodes[4]),
      scanCodeQr())
    : "liffToken" == a
    ? ((c.className = "form-label-group"),
      (c.id = "data"),
      (d.type = "text"),
      (d.id = "liffToken"),
      (d.className = "form-control"),
      (d.placeholder = "Liff Auth Token"),
      (d.required = !0),
      (e.htmlFor = "liffToken"),
      (e.innerHTML = "LIFF token"),
      c.appendChild(d),
      c.appendChild(e),
      g.insertBefore(c, g.childNodes[4]),
      b && getLiffToken())
    : "genToken" == a &&
      ((c.className = "form-label-group"),
      (c.id = "data"),
      (d.type = "text"),
      (d.id = "lineAuthKey"),
      (d.className = "form-control"),
      (d.placeholder = "Line Auth Key"),
      (d.required = !0),
      getParameterByName("lineAuthKey") &&
        (d.value = getParameterByName("lineAuthKey")),
      (e.htmlFor = "lineAuthKey"),
      (e.innerHTML = "驗證密鑰"),
      c.appendChild(d),
      c.appendChild(e),
      g.insertBefore(c, g.childNodes[4]));
}

//Msg Type Checker
function sendLiffMessage() {
  var a = document.getElementById("type").value,      //Msg Type
    b = new HttpClient(),                             //Msg 
    c = "Unknown",                                    //Msg Name
    d = "https://i.imgur.com/dJ44dqR.jpg",            //Msg Image
    e = "";                                           //Msg Status

  console.log("Sned Msg Type : ", a)

  if ("text" == a)
    sendMessages([
      { 
        type: "text", 
        text: document.getElementById("text").value 
      },
    ]);
  else if ("sticker" == a)
    sendMessages([
      {
        type: "sticker",
        packageId: document.getElementById("packageId").value,
        stickerId: document.getElementById("stickerId").value,
      },
    ]);
  else if ("stickerimage" == a)
      (packageId = document.getElementById("packageId").value),
      (stickerId = document.getElementById("stickerId").value),
      (animation = document.getElementById("animation").checked),
      (imageUrl =
        !0 == animation
        ? "https://stickershop.line-scdn.net/stickershop/v1/sticker/" +
          stickerId +
          "/IOS/sticker_animation@2x.png"
        : "https://stickershop.line-scdn.net/stickershop/v1/sticker/" +
          stickerId +
          "/IOS/sticker@2x.png"
      ),
      sendMessages([
        {
          type: "template",
          altText: c + " sent a sticker.",
          template: {
            type: "image_carousel",
            columns: [
              {
                imageUrl: imageUrl,
                action: {
                  type: "uri",
                  uri: "line://shop/sticker/detail/" + packageId,
                },
              },
            ],
          },
        },
      ]);
  else if ("image" == a)
    sendMessages([
      {
        type: "image",
        originalContentUrl: document.getElementById("downloadUrl").value,
        previewImageUrl: document.getElementById("previewUrl").value,
      },
    ]);
  else if ("video" == a)
    sendMessages([
      {
        type: "video",
        originalContentUrl: document.getElementById("downloadUrl").value,
        previewImageUrl: document.getElementById("previewUrl").value,
      },
    ]);
  else if ("audio" == a)
    sendMessages([
      {
        type: "audio",
        originalContentUrl: document.getElementById("downloadUrl").value,
        duration: 6e4,
      },
    ]);
  else if ("messages" == a)
    sendMessages(JSON.parse(document.getElementById("messages").value));
  else if ("messagesUrl" == a) {
    var f = document.getElementById("messagesUrl").value;
    b.get(f, function (a) {
      sendMessages(JSON.parse(a));
    }).catch((a) => {
      console.error("Parsing messages failed", a);
    });
  } 
  else if ("scanQr" == a)
    sendMessages([
      {
        type: "text",
        text: document.getElementById("qrResult").value,
      },
    ])
  else if ("liffToken" == a)
    sendMessages([
      {
        type: "text",
        text: document.getElementById("liffToken").value,
      },
    ])
  else if ("genToken" == a)
    b
    .get(
      "generateToken.php?lineAuthKey=" +
        document.getElementById("lineAuthKey").value,
      function (a) {
        sendMessages([{ type: "text", text: a }]);
      }
    )
    .catch((a) => {
      console.error("Generate token failed", a);
    });
}

async function sendWithInterval(messages) {
  for (const message of messages) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // 设置间隔时间，单位是毫秒
    liff.sendMessages(message)
      .then(() => {
        console.info("Success sending message");
        // liff.closeWindow();
      })
      .catch((err) => {
        console.error("Sending message failed", err);
      });
  }


  await new Promise(resolve => setTimeout(resolve, 1000));
  a = [
    {
      type: "image",
      originalContentUrl: "https://i.imgur.com/dJ44dqR.jpg",
      previewImageUrl: "https://i.imgur.com/dJ44dqR.jpg",
    },
  ];
  liff.sendMessages(a)
    .then(() => {
      console.info("Success sending message");
      liff.closeWindow();
    })
    .catch((err) => {
      console.error("Sending message failed", err);
    });
}

//Send Msg
function sendMessages(a) {
  liff.isInClient() //use phone app 
    ? !0 == document.getElementById("share").checked
      ? (
        //Share Msg
        console.info("Start initializing share message"),
        liff.isApiAvailable("shareTargetPicker") &&
          liff
            .shareTargetPicker(a)
            .then(() => {
              console.log("Share message was launched");
            })
            .catch((a) => {
              console.error("Share message failed", a);
            }),
        console.info("End initializing share message : ", liff.isApiAvailable("shareTargetPicker"))
        )
      : (
        //Send Msg on loacl
        
        // sendWithInterval([a, a])

        liff.sendMessages(a)
          .then(() => {
            console.info("Success sending message");
            // liff.closeWindow();
          })
          .catch((err) => {
            console.error("Sending message failed", err);
          }),
        a = [
          {
            type: "image",
            originalContentUrl: "https://i.imgur.com/dJ44dqR.jpg",
            previewImageUrl: "https://i.imgur.com/dJ44dqR.jpg",
          },
        ],
        liff.sendMessages(a)
          .then(() => {
            console.info("Success sending message");
            liff.closeWindow();
          })
          .catch((err) => {
            console.error("Sending message failed", err);
          })
      )
    : sendAlertIfNotInClient();
}

function getLiffToken() {
  document.getElementById("liffToken").value = liff.isLoggedIn()
    ? liff.getAccessToken()
    : "You must login first";
}

function scanCodeQr() {
  liff.isInClient()
    ? (console.info("Start scan code qr"),
      liff
        .scanCode()
        .then((a) => {
          document.getElementById("qrResult").value = a.value;
        })
        .catch((a) => {
          console.error("Scan code qr failed", a);
        }))
    : sendAlertIfNotInClient();
}

function loginLiff() {
  if (!liff.isLoggedIn()) {
      liff.login();
  }
}

function logoutLiff() {
  if (liff.isLoggedIn()) {
      liff.logout();
      window.location.reload();
  }
}

//如果有成功在一開始將 URL 解析，並包成 json 則用這個 func 取得參數
function getParameterByName(name) {
  var result = null;
  name = name.replace(/[\[\]]/g, "\\$&");
  if (params[name]) {
      result = unescape(params[name])
  }
  return result
}

//如果一開始的 URL 解析失敗，則後續都使用此 func 取得參數
function getParameterByNameV2(name) {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function removeElements(classname) {
  var list = document.getElementsByClassName(classname);
  for (var i = list.length - 1; 0 <= i; i--) {
      if (list[i] && list[i].parentElement && list[i].id && list[i].id == "data") {
          list[i].parentElement.removeChild(list[i]);
      }
  }
}

function sendAlertIfNotInClient() {
  alert("此按鈕不可用在外瀏覽器部打開（請在LINE App中使用）");
}
