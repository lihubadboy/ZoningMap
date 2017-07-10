define('application/login', ['utils/ajaxUtil', 'utils/common'], function(ajaxUtil, common) {
  var Widget = function(options) {
    var _self = this;
    _self.options = options;
    _self.ajaxUtil = new ajaxUtil(_self.options.proxyUrl);
    _self.common = new common();
    _self._getAuthorInfo();
    _self._init();
  };
  Widget.prototype = {
    _init: function() {
      var _self = this;
      _self._event();
    },
    _getAuthorInfo: function() {
      var _self = this;
      var cookies = _self.common.getCookieValue(_self.options.authorInfoKey);
      if (cookies == "" || cookies == null || cookies == undefined) {
        $('.login-form').removeClass('hide');
      } else {
        $('.login-container .list-inline').removeClass('hide').addClass('animated bounceIn');
      }
    },
    _formartUrl: function(url) {
      var _self = this;
      return url.indexOf(window.location.host) > -1 ? url : _self.options.proxyUrl + '?' + url;
    },
    _event: function() {
      var _self = this;

      $('#index').on('click', function(){window.location = 'index.html';});
      $('#administrative').on('click', function(){window.location = 'administrative.html';});
      $('#public').on('click', function(){window.open(_self.options.publicUrl);});
      $(".btn").on("click", function() {
        var username = $("#username").val();
        var password = $("#password").val();
        if (username == "" || password == "") {
          $("#messages").html("<font style='color: red'>用户名或密码为空，请重新输入！</font>");
          return false;
        }

        try {
          $.ajax({
            type: "GET",
            url: _self._formartUrl(_self.options.LoginUrls.url + "?username=" + username + "&password=" + password),
            dataType: "json",
            contentType: "application/json",
            timeout: 2000,
            beforeSend: function() {
              $(".btn-login").html("<img src='images/loading_small.gif' style='height:15px;width:14px'>");
            },
            success: function(data, status, xhr) {
              if (data.data) {
                var author = {
                  userid: data.data.id,
                  username: data.data.alias,
                  localBureau: data.data.localBureau.name
                }
                _self.common.setCookie(_self.options.authorInfoKey, JSON.stringify(author), '', '/');
                $("#messages").html("");
                $('.login-form').addClass('animated bounceOut hide');
                $('.login-container .list-inline').removeClass('hide').addClass('animated bounceIn');
                // window.location.href = "index.html";
              } else {
                $("#messages").html("<font style='color: red'>" + data.msg + "！</font>");
                $("#username").focus();
                $(".btn-login").html("登入");
                return false;
              }
            },
            error: function(xhr, error, exception) {
              $("#messages").html("<font style='color: red'>登录失败！</font>");
              $(".btn-login").html("登入");
            }
          });
        } catch (e) {
          $("#messages").html("<font style='color: red'>登录异常！</font>");
          $(".btn-login").html("登入");
        }
      });
    }

  };

  return Widget;
});