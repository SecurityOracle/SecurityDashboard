widget = {
  //runs when we receive data from the job
  onData: function (el, data) {

    //The parameters our job passed through are in the data object
    //el is our widget element, so our actions should all be relative to that
    
    // If this is the same report the user is already looking at, return
    if (data.report.reportId == $(".content", el).data("reportId")) {
        return;
    } else {
        $(".content", el).data("reportId", data.report.reportId);
    }
    
    if (data.title) {
      $('h2', el).text(data.title);
    }

    $('.content .app-name', el).html(data.report.name);
    $('.content .app-version', el).html(data.report.version);
    $('.content .app-version', el).html(data.report.version);
    
    var content;
    var selectedSolution = [];
    
    if (data.report.vulnerabilities && data.report.vulnerabilities.length > 0) {
        content = $("<table></table>");
        
        data.report.vulnerabilities.forEach(function(vuln) {
            var line = $("<tr/>");
            var info = $("<td/>").addClass("info");
            
            info.append(vuln.module + ":" + vuln.version + "<br/>");
            info.append(vuln.title + "<br/>");
            var link = $("<a>More Info</a>").attr("href", vuln.advisory);
            info.append(link);
            
            var solution = $("<td/>").addClass("solution");
            if (vuln.solution && vuln.solution[0]) {
                var parts = vuln.solution[0].split("@");
                var name = parts[0];
                var version = parts[1];
                
                var button = $("<button>Update " + name + " to version " + version  + "</button>");
                button.on("click", function() {
                    $(this).addClass("solution-selected");
                    selectedSolution.push(vuln.solution[0]);
                    console.log(selectedSolution);
                    $(".app-solution-submit").removeAttr("disabled");
                    $(this).off("click");
                });
                
                solution.append(button);
            } else {
                var message = $("<span>No solution available").addClass("vuln");
                soltion.append(message);
            }
            
            line.append(info).append(solution).appendTo(content);
        });
    } else {
        content = $("<span>None!</span>").addClass("safe");
    }
    
    $(".app-solution-submit").on("click", function(){
        $(".app-solution-message").html("Submitting");
        $.ajax({
            method: "POST",
            url: "https://security-oracle.eu-gb.mybluemix.net/app/" + data.report.appId + "/solutions",
            data: JSON.stringify(selectedSolution),
            contentType: "application/json"  
        }).done(function() {
            $(".app-solution-message").html("Solution submitted. Please cf push again.");
        })
    });
    
    $(".app-solution-submit").attr("disabled", "disabled");
    $(".app-solution-message").html("");
    
    $('.content .vulns', el).html(content);
  }
};