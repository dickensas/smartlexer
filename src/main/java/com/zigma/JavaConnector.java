package com.zigma;

import java.io.File;
import java.io.InputStream;
import java.util.Scanner;

import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.TextField;
import javafx.scene.control.TextArea;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import netscape.javascript.JSObject;

public class JavaConnector {
    protected static JSObject javascriptConnector;
    protected static Scene scene;

    public JavaConnector(final Scene scene) {
        this.scene = scene;

        WebView webview = (WebView) this.scene.lookup("#mywebview");
        final WebEngine webEngine = webview.getEngine();

        JSObject window = (JSObject) webEngine.executeScript("window");
        window.setMember("javaConnector", this);
        Button button = (Button) this.scene.lookup("#mybutton");
        button.setVisible(true);
        TextField dbLoc = (TextField) this.scene.lookup("#dbLoc");
        InputStream fis = null;
        try {
            String dbLocTxt = dbLoc.getText();
            String database = null;
            if(dbLocTxt!=null && !dbLocTxt.trim().equals("")) {
                System.out.print("Hi1");
                database = new Scanner(new File(dbLocTxt)).useDelimiter("\\Z").next();
                System.out.print("Hi2");
            }else {
                database = new Scanner(new File("test\\sql\\data\\sql.json")).useDelimiter("\\Z").next();
            }
            javascriptConnector = (JSObject) webEngine.executeScript("getJsConnector()");
            javascriptConnector.call("setJSON", "database", database);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (fis != null) {
                try {
                    fis.close();
                } catch (Exception e) {
                }
            }
        }
    }

    public void log(String txt) {
        System.out.println(txt);
    }

    public void showLex(String sql) {
        TextArea txt = (TextArea) this.scene.lookup("#trgLex");
        txt.setText(sql);
    }

    public JSObject emit(JSObject obj) {
        System.out.println(obj);
        if (obj.getMember("type") == "MemberExpression") {
            JSObject object = (JSObject) obj.getMember("object");
            JSObject property = (JSObject) obj.getMember("property");
        } else if (obj.getMember("type") == "SequenceExpression") {
            JSObject expressions = (JSObject) obj.getMember("expressions");
        }
        return obj;
    }
}
