package com.goodow.drive.server.attachment;

import com.google.appengine.api.blobstore.BlobKey;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Attachment {
  @Id
  private String id;
  private BlobKey blobKey;
  private List<String> tags;

  public BlobKey getBlobKey() {
    return blobKey;
  }

  public String getId() {
    return id;
  }

  public void setBlobKey(BlobKey blobKey) {
    this.blobKey = blobKey;
  }

  public void setId(String id) {
    this.id = id;
  }

  public List<String> getTags() {
    return tags;
  }

  public void setTags(List<String> tags) {
    this.tags = tags;
  }
}
