var webapiserver = "192.168.1.3";
var webapiserver_port = "8080";

function update_ci_attr(obj){
    var hostname = document.getElementById("step1_host_name").value;
    var step1_description = document.getElementById("step1_description").value;
    alert(hostname+step1_description);
    var url = "http://"+$webapiserver+":"+$webapiserver_port+"/ci?name=slave12&ci_type_fid=FCIT00000001";
                $.post(url,null,function(data){alert("insert successful");})
                } 

$(document).ready(function(){
    var table = $('#allhostlist').DataTable( {
        "bAutoWidth": false,                                        //页面自动宽度
        "processing" : true,
        "bPaginate": true,                                        //页面分页（右下角）
        "aLengthMenu":  [[10, 25, 50, -1], ["每页10条", "每页25条", "每页50条", "显示所有数据"]],
//        "ajax" : {
//            "url" : "/ajax_gethostlist",
//            "dataSrc" : "",
//            "async" : false, 
//            "bDeferRender": true
//        },
//        "aoColumns": [
//            { "data": "HOSTNAME" },
//            { "data": "KERNEL_VERSION" },
//            { "data": "DESCRIPTION" },
//        ],
//        "initComplete": function () {
//            var api = this.api();
//            api.$('tr').click( function () {
//                点击行执行动作，tr改成td也可以有相应的动作
//            } );
//        },
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
    //增加表格隔行不同颜色功能
    $('#allhostlist tbody th').click(function(){ //这行的td可以替换为 th  ，主要看表格里是什么
        var clickObj = $(this); 
  
        //获取当前操作对象
        content = clickObj.html();
        changeToEdit(clickObj);
    }); 

    function changeToEdit(node){ 
        node.html("");
        var inputObj = $("<input id='ciarrtvalue' type='text'/></div>"); 
        //插入一个可编辑的 input对象
        inputObj.css("border","1").css("background-color",node.css("background-color"))
            .css("font-size",node.css("font-size")).css("height","80%")
            .css("width", "95%").val(content).appendTo(node) 

        inputObj.click(function(){ 
            return false; 
        }).keyup(function(event){ 
            var keyvalue = event.which; 
            if(keyvalue==13){ 
                //13 是enter键
                //alert(document.getElementById("tmptest").value);
                $('#myModal').modal("show");
                
                $('#submitModify').click(function(){
                    alert("1");    
                });
                
                $('#cancelModify').click(function(){
                    node.focus().html(content);     
                });
                
                
//                if(confirm("是否保存？","Yes","No")){ 
//                    node.html(node.children("input").val()); 
//                }else{ 
//                    node.html(content); 
//                } 
            } 
            if(keyvalue==27){ 
                //27是esc键
                node.html(content);
            } 
        }).blur(function(){ 
            if(node.children("input").val()!=content){ 
                if(confirm("是否保存？","Yes","No")){ 
                    node.html(node.children("input").val()); 
                }else{ 
                    node.html(content); 
                } 
            }else{ 
                node.html(content); 
            } 
        });
    } 

});



