package com.goodow.drive.android.Interface;

import com.goodow.realtime.EventHandler;
import com.goodow.realtime.ValueChangedEvent;
import elemental.json.JsonArray;

public interface IRemoteControl {
	public void changeDoc(String docId);

	public void addPath(String mapId);

	public void removeLastPath();

	public void freshMap();
	
	public JsonArray getCurrentPath();

	public String getMapId(int index);

	public void addListener(
			EventHandler<ValueChangedEvent> pathChangeEventHandler);

}
