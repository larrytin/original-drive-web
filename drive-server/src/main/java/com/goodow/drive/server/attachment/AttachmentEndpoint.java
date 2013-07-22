package com.goodow.drive.server.attachment;

import com.goodow.realtime.operation.id.IdGenerator;

import com.google.api.server.spi.config.AnnotationBoolean;
import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiMethod.HttpMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.appengine.api.blobstore.BlobInfo;
import com.google.appengine.api.blobstore.BlobInfoFactory;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.inject.Inject;
import com.google.inject.Provider;
import com.google.inject.persist.Transactional;

import javax.inject.Named;
import javax.persistence.EntityExistsException;
import javax.persistence.EntityManager;
import javax.persistence.EntityNotFoundException;

@Api(name = "attachment", version = "v0.0.1", defaultVersion = AnnotationBoolean.TRUE, namespace = @ApiNamespace(ownerDomain = "goodow.com", ownerName = "Goodow", packagePath = "api.services"))
public class AttachmentEndpoint {
  @Inject
  private IdGenerator idGenerator;
  @Inject
  private BlobstoreService blobstoreService;
  @Inject
  private BlobInfoFactory blobInfoFactory;
  @Inject
  private Provider<EntityManager> em;

  @ApiMethod(name = "get")
  public Attachment get(@Named("id") String id) {
    return em.get().find(Attachment.class, id);
  }

  @ApiMethod(name = "getFormAction")
  public BoxedString getFormAction() {
    String formAction = blobstoreService.createUploadUrl("/upload");
    if (formAction == null) {
      throw new RuntimeException("Null blobstore upload url");
    }
    return new BoxedString(formAction);
  }

  @ApiMethod(name = "insert")
  @Transactional
  public Attachment insert(Attachment attachment) {
    if (attachment.getId() == null) {
      attachment.setId(idGenerator.next(115));
    }
    if (contains(attachment)) {
      throw new EntityExistsException("Object already exists");
    }
    em.get().persist(attachment);
    return attachment;
  }

  @ApiMethod(name = "loadBlobInfo")
  public BlobInfo loadBlobInfo(@Named("id") String id) {
    Attachment attachment = get(id);
    return blobInfoFactory.loadBlobInfo(attachment.getBlobKey());
  }

  @ApiMethod(name = "remove", httpMethod = HttpMethod.POST)
  public Attachment remove(@Named("id") String id) {
    Attachment attachment = em.get().find(Attachment.class, id);
    em.get().remove(attachment);
    return attachment;
  }

  @ApiMethod(path = "update", httpMethod = HttpMethod.POST)
  public Attachment update(Attachment attachment) {
    if (!contains(attachment)) {
      throw new EntityNotFoundException("Object does not exist");
    }
    em.get().persist(attachment);
    return attachment;
  }

  private boolean contains(Attachment attachment) {
    boolean contains = true;
    Attachment item = em.get().find(Attachment.class, attachment.getId());
    if (item == null) {
      contains = false;
    }
    return contains;
  }
}
