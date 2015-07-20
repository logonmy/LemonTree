#coding:utf-8
import web
import sys
import httplib, urllib
import json


ERR_URL_WITHTOUT_NECESSARY_ATTR = 1

urls = (
        '/index'            ,'index',
        '/hostinfo'         ,'hostinfo',
        '/hostlist'         ,'hostlist',
        '/hostbaselinelist' ,'hostbaselinelist',
        '/addhost'          ,'addhost',
        '/ajax_gethostlist' ,'ajax_gethostlist',
        '/ajax_get_ci_all_attr'      , 'ajax_get_ci_all_attr',
        '/ajax_get_citype_all_attr'  , 'ajax_get_citype_all_attr',
        '/ajax_getosuser_baseline'   ,'ajax_getosuser_baseline',
       )

def HttpConnectionInit(host = '192.168.1.3', port = 8080):
    return httplib.HTTPConnection(host, port)

def HttpConnectionClose(connection):
    connection.close()

class index:
    def GET(self):
        name = None
        render = web.template.render('templates/', base='layout')
        return render.index(name)
     
    def POST(self):
        pass
        
class hostinfo:
    def GET(self):
        server = web.input(host = "slave1")     #页面url中传入的参数：主机名
        render = web.template.render('templates/host/', base='layout_info')
        if server is None:
            return render.hostinfo()
        
        conn  =  HttpConnectionInit()
        #返回主机所有CI TYPE
        url_citype = "/citype?owner=OS"
        conn.request(method = "GET",url = url_citype)
        data_citype = json.loads(conn.getresponse().read())

        list_citype = []
        for citype in data_citype:
            temp_dict = {}
            for key,value in citype.items():
                o_key = key.encode('utf-8')
                if not value:
                    o_value = ""
                else:
                    o_value = value.encode('utf-8') 
                temp_dict[o_key] = o_value
                
            list_citype.append(temp_dict)

        #返回对应主机名下的所有CI
        url_ci = "/cirela?sourcename=" + server.host
        conn.request(method = "GET",url = url_ci)
        data_ci = json.loads(conn.getresponse().read())
        
        dict_ci = {}
        for ci in data_ci:
            temp_cidict = {}
            if ci["TARGET_TYPE_FID"].encode('utf-8') not in dict_ci:
                dict_ci[ci["TARGET_TYPE_FID"].encode('utf-8')] = []
            for key,value in ci.items():
                o_key = key.encode('utf-8')
                if not value:
                    o_value = ""
                else:
                    o_value = value.encode('utf-8')
                temp_cidict[o_key] = o_value
            dict_ci[ci["TARGET_TYPE_FID"].encode('utf-8')].append(temp_cidict)

        HttpConnectionClose(conn)
        return render.hostinfo(list_citype, dict_ci, host = server.host)

    def POST(self):
        pass
    
class hostlist:
    def GET(self):
        render = web.template.render('templates/host/', base='layout')
        return render.hostlist()
        
    def POST(self):
        pass

class hostbaselinelist:
    def GET(self):
        render = web.template.render('templates/host/', base='layout')
        return render.hostbaselinelist()
    
    def POST(self):
        pass
    
class addhost:
    def GET(self):
        render = web.template.render('templates/host/', base='layout_info')
        return render.addhost()

class ajax_get_ci_all_attr:
    def GET(self):
        url_ciattr = "/ciattr"
        token_init = 0
        result = web.input(cifid = None, ci_type_fid = None)
        conn  =  HttpConnectionInit()
        
        if result.cifid :
            if token_init == 0:
                url_ciattr += "?ci_fid=" + result.cifid
                token_init = 1
            else:
                url_ciattr += "&ci_fid=" + result.cifid
        
        conn.request(method = "GET",url = url_ciattr)
        data = conn.getresponse().read()
        HttpConnectionClose(conn)
        return data

class ajax_get_citype_all_attr:
    def GET(self):
        url_citypeattr = "/ciattrtype"
        token_init = 0
        result = web.input(ci_type_fid = None)
        conn  =  HttpConnectionInit()
        
        if result.ci_type_fid :
            if token_init == 0:
                url_citypeattr += "?ci_type_fid=" + result.ci_type_fid
                token_init = 1
            else:
                url_citypeattr += "&ci_type_fid=" + result.ci_type_fid
        
        print url_citypeattr    
        conn.request(method = "GET",url = url_citypeattr)
        data = conn.getresponse().read()
        HttpConnectionClose(conn)
        return data
    
class ajax_gethostlist:
    def GET(self):
        conn  =  HttpConnectionInit()
        #返回主机所有CI TYPE
        url_citype = "/ci?citype_name=HOST_OS"
        conn.request(method = "GET",url = url_citype)
        formatdata = json.loads(conn.getresponse().read())
        
        list_host = []                      #OS列表，保存所有主机
        #获取所有主机列表，每个OS信息对应一个字典
        for ci in formatdata:
            temp_dict = {}
            if ci["DESCRIPTION"] is None:
                temp_dict["DESCRIPTION"] = ""
            else:
                temp_dict["DESCRIPTION"] = ci["DESCRIPTION"].encode('utf-8')
            
            cifid = ci["FAMILY_ID"].encode('utf-8')
            url_ciattr = "/ciattr?ci_fid=" + cifid
            conn.request(method="GET", url = url_ciattr)
            data_ciattr = json.loads(conn.getresponse().read())
            #遍历OS的所有属性，将所有属性保存为key-value形式
            for eachattr in data_ciattr:
                temp_dict[eachattr["CIAT_NAME"].encode('utf-8')] = eachattr["VALUE"].encode('utf-8')
                
            list_host.append(temp_dict)
        
        HttpConnectionClose(conn)    
        return json.dumps(list_host, indent = 4,ensure_ascii=False, separators = (',',':'))
        
class ajax_getosuser_baseline:
    def GET(self):
        conn = HttpConnectionInit()
        url = "/ci?citype_name=OS_USER&tag=BASELINE:OS"
        conn.request(method = "GET",url = url)
        formatdata = json.loads(conn.getresponse().read())
        
        return json.dumps(formatdata, indent = 4,ensure_ascii=False, separators = (',',':'))
        
class ajax_post_ci:
    def POST(self):
        url_params = web.input(desciption=None, tag=None, priority=0, owner=None)
        ciname = url_params.get('name')
        citype_fid = url_params.get('ci_type_fid')
        
        conn  =  HttpConnectionInit()
        if ciname is None or citype_fid is None:
            return ERR_URL_WITHTOUT_NECESSARY_ATTR
        
        params = {'name': ciname, 'ci_type_fid': citype_fid}
        if url_params.descriptions is not None:
            params['description'] = url_params.descriptions
        
        if url_params.tag is not None:
            params['tag'] = url_params.tag
            
        if url_params.priority is not None:
            params['priority'] = url_params.priority
        
        if url_params.owner is not None:
            params['owner'] = url_params.owner
        
        params = urllib.urlencode(params)
        headers = {"Content-type": "application/x-www-form-urlencoded"
                    , "Accept": "text/plain"}
        conn.request("POST", url_params, params, headers)
        
        response = conn.getresponse()
        HttpConnectionClose(conn)
        
         
 
if __name__ == "__main__":
    app = web.application(urls, globals())
    app.run()
