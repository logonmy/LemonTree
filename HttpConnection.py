#coding:utf-8
'''
Created on 2015-7-27
@author: IntPassion
'''
import httplib, urllib

class HttpConnection:
    def __init__(self):
        '''
        Constructor
        '''
        conn = None;
        
    def HttpConnectionInit(self, host = '192.168.1.3', port = 8080):
        self.conn = httplib.HTTPConnection(host, port)

    def HttpConnectionClose(self):
        self.conn.close()
        
    def HttpRequest(self, method, url, body=None, headers=None):
        self.conn.request(method, url, body, headers)
        