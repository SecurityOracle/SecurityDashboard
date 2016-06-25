widget = {
  //runs when we receive data from the job
  onData: function (el, data) {

    //The parameters our job passed through are in the data object
    //el is our widget element, so our actions should all be relative to that
    if (data.title) {
      $('h2', el).text(data.title);
    }

    var content = $('.content', el);
    content.html("");
    
    data.reports.forEach(function(report) {
        var version = report.version;
        var name = report.name;
        var vulnerable = report.vulnerabilities.length > 0;
        
        $("<div>" + name + ":" + version + "</div>").addClass(vulnerable ? "vuln" : "safe").appendTo(content);
    })
  }
};