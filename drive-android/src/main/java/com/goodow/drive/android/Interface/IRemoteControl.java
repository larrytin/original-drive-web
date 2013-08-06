package com.goodow.drive.android.Interface;

import elemental.json.JsonArray;

public interface IRemoteControl {
  public void changeDoc(String docId);

  public void changePath(String mapId);

  public JsonArray getCurrentPath();

  public String getMapId(int index);

  public void setNotifyData(INotifyData iNotifyData);

}
