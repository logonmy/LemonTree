
//        $$(document).ready(function() {
//            $$.ajax({  
//                url : '/static/data/data_json.txt',  
//                dataType : "json",  
//                success : function(data){  
//                    var vardiv = '';
//                    //����������CI TYPE����DIV��DIV��ID��CI TYPE��FID����
//                    for(var i = 1; i < data.length; i++)
//                    {
//                        //ʹ��ci type family_id ��Ϊdiv��id,��cirela�Ĳ�ѯ�У�����ֱ���õ�ci��type family_id
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

