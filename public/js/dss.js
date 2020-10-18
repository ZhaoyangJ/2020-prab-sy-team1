$(async function() {
    let rs = await request({
      url: "/dss/inquiry.json/-1",
      method: "GET"
    });
    if (200 === rs.code) {
        let _html = "<div class='info-pane'>";
        for (const dm of rs.dssMenu) {
            _html += `${dm.id} - ${dm.content}<br/>`;
        }
        // _html += new Date();
        _html += "</div>";
        $("#content-pane").html(_html)
    }

    $("#send-btn").on("click", async function() {
        let parentId = $("#parent-id").val();
        $("#parent-id").val("");
        if (parentId) {
            $("#content-pane").append("<div class='alert alert-warning'>" + parentId + "</div>");
            let rs = await request({
              url: "/dss/inquiry.json/" + parentId,
              method: "GET",
            });
            if (200 === rs.code) {
              let _html = "<div class='info-pane'>";
              if (rs.dssMenu.length > 0) {
                  for (const dm of rs.dssMenu) {
                    _html += `${dm.id} - ${dm.content}<br/>`;
                  }
              } else {
                  return;
              }
              // _html += new Date();
              _html += "</div>";
              console.log(rs.dssMenu);
              $("#content-pane").append(_html);
            }
        }
    });
});