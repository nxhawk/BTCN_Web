async function getMessage() {
  let res = await fetch("/chat/message");
  let message = await res.json();
  postMessage(message);
  setTimeout("getMessage()", 500);
}

getMessage();
