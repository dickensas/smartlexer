package com.zigma;

import java.net.URL;
import java.util.ResourceBundle;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.TextArea;
import netscape.javascript.JSObject;

public class Controller implements Initializable {
    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        System.out.println("controller init");
    }

    @FXML
    private void parseLex(ActionEvent event) {
        if (JavaConnector.javascriptConnector == null) {
            JavaConnector.javascriptConnector = 
            (JSObject) JavaConnector.webEngine.executeScript("getJsConnector()");
        }
        if (JavaConnector.javascriptConnector != null) {
            TextArea txt = (TextArea) JavaConnector.scene.lookup("#srcLex");
            JavaConnector.javascriptConnector.call("parseToLex", txt.getText());
        } else {
            System.out.println("javascriptConnector is null");
        }
    }
}
