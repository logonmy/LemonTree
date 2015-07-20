var webapiserver = "192.168.1.3";
var webapiserver_port = "8080";

/*  参数备注：fid   ->    ci attribute的family id
    change_log为必须输入项，description默认为空
    value和owner如果不输入的话，将使用原来的默认值
*/
function update_ci_attr(fid, change_log, value=null, description=null, owner=null ){
    var url = "http://"+webapiserver+":"+webapiserver_port+"/ciattr?fid=" + fid +
              "&change_log=" + change_log;
    
    if (value != null) { url += "&value=" + value; }
    if (description != null) { url += "&description=" + description; }
    if (owner != null) { url += "&owner=" + owner; }
    //url = "http://192.168.1.3:8080/ci?name=niusheng&ci_type_fid=FCIT00000001";
    url = "192.168.1.3:8080/ciattr?fid=FCAD00000002&change_log=test&value=3.1.1";
    alert(url);
    $.post(url, null, function(data){
        alert("insert successful");
    }).error(function(){
        alert("insert failed");
    });
}

function changeToEdit(node, content){ 
    node.html("");
    var inputObj = $("<input id='ciattrvalue' type='text'/></div>"); 
    //插入一个可编辑的 input对象
    inputObj.css("border","1").css("background-color",node.css("background-color"))
        .css("font-size",node.css("font-size")).css("height","80%")
        .css("width", "95%").val(content).appendTo(node) 
    $('#ciattrvalue').focus();
    
    inputObj.click(function(){ 
        return false; 
    }).keyup(function(event){ 
        var keyvalue = event.which; 
        if(keyvalue==13){ 
            //13 是enter键
            //alert(document.getElementById("tmptest").value);
            $('#myModal').modal("show");
            node.html(content);
            $('#submitModify').click(function(){
                update_ci_attr("FCAD00000002", "test", "3.1.1");
                node.html(node.children("input").val());
            });
            
            $('#cancelModify').click(function(){
                node.html(content);
            });
            
            
//              if(confirm("是否保存？","Yes","No")){ 
//                  node.html(node.children("input").val()); 
//              }else{ 
//                  node.html(content); 
//              } 
        } 
        if(keyvalue==27){ 
            //27是esc键
            node.html(content);
        } 
    });
}

$(document).ready(function(){
    var table = $('#allhostlist').DataTable( {
        "bAutoWidth": false,                                        //页面自动宽度
        "processing" : true,
        "bPaginate": true,                                        //页面分页（右下角）
        "aLengthMenu":  [[10, 25, 50, -1], ["每页10条", "每页25条", "每页50条", "显示所有数据"]],
        "ajax" : {
            "url" : "/ajax_gethostlist",
            "dataSrc" : "",
            "async" : false, 
            "bDeferRender": true
        },
        "aoColumns": [
            { "data": "HOSTNAME" },
            { "data": "KERNEL_VERSION" },
            { "data": "DESCRIPTION" },
        ],
        "columnDefs": [ 
            {
            "targets": 0,
            "mRender" : function(data, type, full){
                            return "<a href=\"/hostinfo?host="+data+"\" target=\"_black\">"+data+"</a>";
                        }
            },
            {
            "searchable" : false,
            "orderable" : false,
            "targets" : 2,
            },
             
        ],
        "oLanguage": {                                             //自定义内容——国际化
            "sLengthMenu": "显示 _MENU_ ",
            "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
            //"sInfo": "共 _TOTAL_ 个主机",
            "sInfoEmpty": "没有相关数据",
            "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
            "oPaginate": {
                "sFirst": "首页" ,
                "sPrevious": "上一页",
                "sNext": "下一页",
                "sLast": "尾页"
            },
            "sZeroRecords": "没有检索到数据",
            "sInfoEmtpy": "找不到相关数据",    
            "sInfoFiltered": "数据表中共为 _MAX_ 条记录)",    
            "sProcessing": "正在加载中...",    
            "sSearch": "搜索：",    
        },
        "fnDrawCallback": function () {
            $('#allhostlist tbody th').editable( 
                './editable_ajax.php', {
                "callback": function( sValue, y ) {
                    /* Redraw the table from the new data on the server */
                    oTable.fnDraw();
                },
                "height": "14px"
            } );
        }
    } );

    $('a.toggle-vis').on( 'click', function (e) {
        e.preventDefault();
        // Get the column API object
        var column = table.column( $(this).attr('data-column') );
        // Toggle the visibility
        column.visible( ! column.visible() );
    } );

    var content;   
    $('#allhostlist tbody th').click(function(){
        var clickObj = $(this); 
  
        //获取当前操作对象
        content = clickObj.html();
        changeToEdit(clickObj, content);
    }); 

});



