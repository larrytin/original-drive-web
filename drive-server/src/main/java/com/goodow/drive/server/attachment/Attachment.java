package com.goodow.drive.server.attachment;

import com.google.appengine.api.blobstore.BlobKey;

import java.util.List;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Attachment {
  @Id
  private String id;
  private String filename;
  private String contentType;
  private BlobKey blobKey;
  @ElementCollection
  private List<String> tags;

  public BlobKey getBlobKey() {
    return blobKey;
  }

  public String getContentType() {
    return contentType;
  }

  public String getFilename() {
    return filename;
  }

  public String getId() {
    return id;
  }

  public List<String> getTags() {
    return tags;
  }

  public void setBlobKey(BlobKey blobKey) {
    this.blobKey = blobKey;
  }

  public void setContentType(String contentType) {
    this.contentType = contentType;
  }

  public void setFilename(String filename) {
    this.filename = filename;
  }

  public void setId(String id) {
    this.id = id;
  }

  public void setTags(List<String> tags) {
    this.tags = tags;
  }
}
