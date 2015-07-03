
//        $$(document).ready(function() {
//            $$.ajax({  
//                url : '/static/data/data_json.txt',  
//                dataType : "json",  
//                success : function(data){  
//                    var vardiv = '';
//                    //遍历，依据CI TYPE生成DIV，DIV的ID以CI TYPE　FID定义
//                    for(var i = 1; i < data.length; i++)
//                    {
//                        //使用ci type family_id 作为div的id,在cirela的查询中，可以直接拿到ci的type family_id
//                        vardiv += "<div class=\"page-header\">" +
//                                  "    <h4 class=\"panel-title\" id=\""+data[i]["TARGET_TYPE_FID"]+"\">" +
//                                  data[i]["TARGETDISPLAYNAME"] + "</h4>" +
//                                  "</div>" + 
//                                  "<table id=\"tab_"+ data[i]["TARGET_TYPE_FID"] +"\"><thead><tr>" +
//                                  "    <td>Name</td>" +
//                                  "    <td>Position</td>" +
//                                  "    <td>Office</td>" +
//                                  "    <td>Salary</td>" +
//                                  "</tr></thead></table>";
//                    }
//
//                    $$('#accordionmain').append(vardiv);
//                    for(var i = 1; i < data.length; i++)
//                    {
//                        $$('#tab' + data[i]["TARGET_TYPE_FID"]).dataTable( {
//                            "ajax" : {
//                                "url" : "/static/data/data_json.txt",
//                                //"url" : "http://192.168.1.3:8080/cirelatype?sourcename=HOST_OS",
//                                "dataSrc": ""
//                            },
//                            "columns": [
//                                { "data": "SOURCENAME" },
//                                { "data": "SOURCEDISPLAYNAME" },
//                                { "data": "TARGETNAME" },
//                                { "data": "TARGETDISPLAYNAME" },
//                            ]
//                        } );
//                    }
//                },
//                error : function(XMLResponse){alert(XMLResponse.responseText)}
//            });  

$(document).ready(function() {
    $('#example').dataTable( {
        "ajax" : {
            "url" : "/static/data/data_json.txt",
            "dataSrc": ""
        },
        "columns": [
            { "data": "SOURCENAME" },
            { "data": "SOURCEDISPLAYNAME" },
            { "data": "TARGETNAME" },
            { "data": "TARGETDISPLAYNAME" },
        ]
    } );
} );

