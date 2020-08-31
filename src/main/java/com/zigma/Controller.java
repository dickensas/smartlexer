package com.zigma;

import java.net.URL;
import java.util.ResourceBundle;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.TextArea;

public class Controller implements Initializable{
	@Override
    public void initialize(URL url, ResourceBundle resourceBundle)
    {
		System.out.println("controller init");
    }
	
	@FXML
    private void parseLex(ActionEvent event)
    {
        if(JavaConnector.javascriptConnector!=null){
        	TextArea txt = (TextArea) JavaConnector.scene.lookup("#srcLex");
        	JavaConnector.javascriptConnector.call("parseToLex", txt.getText());
        }
    }
}
