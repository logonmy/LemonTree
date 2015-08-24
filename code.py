#coding:utf-8
import web
import sys, re, json
import httplib, urllib
from OracleConnector import OracleConnector

ERR_URL_WITHTOUT_NECESSARY_ATTR = 1

reload(sys)
sys.setdefaultencoding('utf-8')


urls = (
        '/index'            , 'index',
        '/hostinfo'         , 'hostinfo',
        '/hostlist'         , 'hostlist',
        '/baselinelist'     , 'baselinelist',
        '/baselineinfo'     , 'baselineinfo',
        '/addhost'          , 'addhost',
        '/addbaseline'      , 'addbaseline',
        
        '/ajax_get_hostlist'    , 'cmdbAPI.ajax_get_hostlist',
        
        '/ajax_ci'              , 'cmdbAPI.ajax_ci',
        '/ajax_cirela'          , 'cmdbAPI.ajax_cirela',
        '/ajax_ciattr'          , 'cmdbAPI.ajax_ciattr',
        '/ajax_citype'          , 'cmdbAPI.ajax_citype',
        '/ajax_cirelatype'      , 'cmdbAPI.ajax_cirelatype',
        '/ajax_ciattrtype'      , 'cmdbAPI.ajax_ciattrtype',

        '/ajax_baselinelist'    , 'cmdbAPI.ajax_baselinelist',
        
        '/ajax_copy_ci'         , 'cmdbAPI.ajax_copy_ci',
       )


def HttpConnectionInit(host = '192.168.1.3', port = 8080):
    return httplib.HTTPConnection(host, port)

def HttpConnectionClose(connection):
    connection.close()

class index:
    def GET(self):
        name = None
        render = web.template.render('templates/', base='host/layout')
        return render.index(name)
     
    def POST(self):
        pass
        
class hostinfo:
    def GET(self):
        server = web.input()     #页面url中传入的参数：主机名和执行的类型
        render = web.template.render('templates/host/', base='layout_info')
        if server is None:
            return web.template.render('templates/host/', base='layout').hostlist()

        db = web.database(dbn='oracle', user='host', pw='host123', db='cffexcmdb')
        conn = HttpConnectionInit()
        #获取与该主机(CI)具有关系的所有CI项
        conn.request(method = "GET",url = "/cirela?sourcename=" + server.host)
        data = json.loads(conn.getresponse().read())
        
        baselist = []                       #保存该主机应用的基线类型
        #保存该主机非基线TAG的CI Dict，其中，以CITYPE作为key，value为属于这个TYPE的CI组成的list
        ciDictWithoutTag = {}
        #遍历该CI项，将基线CI与非基线CI分别保存到不同的列表中
        for ci in data:
            conn.request(method = "GET",url = "/ci?family_id=" + ci["TARGET_FID"].encode('utf-8') )
            resultCI = json.loads(conn.getresponse().read())
            
            resultci = resultCI[0]
            if resultci["TAG"]:
                baselist.append(resultci["TAG"])
            else:
                if not ciDictWithoutTag.has_key(resultci['CITYPE_NAME']):
                    ciDictWithoutTag[resultci['CITYPE_NAME']] = []
                ciDictWithoutTag[resultci['CITYPE_NAME']].append(resultci)
                    
        baselist = list(set(baselist))
        baselist = "|".join(baselist)
        
        list_citype = None
        dict_ci = None
        HttpConnectionClose(conn)

        return render.hostinfo(baselist, ciDictWithoutTag, host = server.host)
    
class hostlist:
    def GET(self):
        render = web.template.render('templates/host/', base='layout')
        return render.hostlist()
        
    def POST(self):
        pass

class baselinelist:
    def GET(self):
        render = web.template.render('templates/host/', base='layout_info')
        return render.baselinelist()
    
    def POST(self):
        pass

class baselineinfo:
    def GET(self):
        result = web.input(type=None, title=None)
        render = web.template.render('templates/host/', base='layout_info')
        if result is None:
            return web.template.render('templates/host/', base='layout_info').baselinelist()
        
        #返回主机所有CI TYPE
        url_ci = "/ci?tag=BASELINE:" + result.type
        conn  =  HttpConnectionInit()
        conn.request(method = "GET",url = url_ci)
        data = json.loads(conn.getresponse().read())

        displayname_list = {}
        for each in data:
            typename = each["TYPE_DISPLAYNAME"]
            cifid = each["FAMILY_ID"]
            if displayname_list.get(typename) is None:
                displayname_list[typename] = []
            displayname_list[typename].append(cifid)
        
        title = result.title
        if title is None:
            title = result.type
        HttpConnectionClose(conn)
        return render.baselineinfo(displayname_list, title)        
        
class addhost:
    def GET(self):
        render = web.template.render('templates/host/', base='layout_info')
        return render.addhost()
    
class addbaseline:
    def GET(self):
        render = web.template.render('templates/host/', base='layout_info')
        urlCiType = "/citype?owner=OS"
        conn  =  HttpConnectionInit()
        conn.request(method = "GET",url = urlCiType)
        citypelist = json.loads(conn.getresponse().read())
        
        
        return render.addbaseline(citypelist)
         
if __name__ == "__main__":
    app = web.application(urls, globals())
    app.run()
