var chatbot = {
  db: [],
  replyDelay: 800,

  getDB: function (link) {
    return new Promise((resolve, reject) => {
      Papa.parse(link, {
        download: true,
        header: true,
        complete: (results) => resolve(results.data)
      });
    });
  },

  dbFilter: function (db, col, val) {
    return db.filter((row) => row[col].toLowerCase().includes(val.toLowerCase()));
  },

  dbFilter2: function (db, col, val) {
    if (!Array.isArray(val)) val = [val];
    return db.filter((row) => val.every((v) => row[col].toLowerCase().includes(v.toLowerCase())));
  },

  loadFiles: function (filenames) {
    bot = new RiveScript();
    bot.loadFile(filenames).then(on_load_success).catch(on_load_error);
  },

  getReply: function (text) {
    bot.reply(null, text).then(
      (reply) => this.postReply(reply.replace(/\n/g, "<br>")),
      (reason) => console.log(reason)
    );
  },

  postReply: function (reply, delay = this.replyDelay) {
    setTimeout(() => {
      const rand = Math.round(Math.random() * 10000);
      $("#dialogue").append(
        `<div class='bot-row' id='${rand}'><span class='bot'>${reply}</span></div>`
      );
      if (typeof pop !== "undefined") pop.play();
      if (typeof onChatbotReply === "function") onChatbotReply();
      $(`#${rand}`).hide().fadeIn(200);
      $("#dialogue").animate({ scrollTop: $("#dialogue")[0].scrollHeight }, 200);
    }, delay);
  },

  sendMessage: function () {
    const text = $("#message").val();
    if (text.length === 0) return false;
    $("#message").val("");
    $("#dialogue").append(
      `<div class='user-row'><span class='user'>${this.escapeHtml(text)}</span></div>`
    );
    $("#dialogue").animate({ scrollTop: $("#dialogue")[0].scrollHeight }, 200);
    this.getReply(text);
    return false;
  },

  escapeHtml: function (text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
};

function on_load_success() {
  $("#message").removeAttr("disabled").attr("placeholder", "Message");
  bot.sortReplies();
  chatbot.getReply("start");
}

function on_load_error(err) {
  chatbot.postReply("Yikes, there was an error loading this bot. Refresh the page please.");
  console.log("Loading error: " + err);
}

var pop;

function setup() {
  pop = new Audio('pop.mp3');
  chatbot.loadFiles(['bot.rive']);
}

window.onload = setup;
