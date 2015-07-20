#coding:utf-8
'''
Created on 2015-7-20

@author: niusheng
'''

import cx_Oracle
import os, sys
import datetime,time


class OracleConnector:

    conn = ''
    cursor = ''
    
    def __init__(self, user, passwd, database) :
        self.user = user
        self.passwd = passwd
        self.database = database        
    
    def connect(self):
        try :
            self.conn = cx_Oracle.connect(self.user, self.passwd, self.database)
            self.cursor = self.conn.cursor()
        except Exception as e:
            print e
            sys.exit(-1)
            
    def select(self, sql):
        if sql is None:
            print "SQL can't be none"
            return;
        
        self.cursor.execute(sql)
        result = self.cursor.fetchall()
        return result
        
    
    def close(self):
        try:
            self.cursor.close()
            self.conn.close()
        except Exception as e:
            print e
            sys.exit(-1)