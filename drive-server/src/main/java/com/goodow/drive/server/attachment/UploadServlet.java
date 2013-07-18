/*
 * Copyright 2012 Goodow.com
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */
package com.goodow.drive.server.attachment;

import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.common.collect.Iterables;
import com.google.gson.Gson;
import com.google.inject.Inject;
import com.google.inject.Singleton;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Singleton
public class UploadServlet extends HttpServlet {
  private static final Logger log = Logger.getLogger(UploadServlet.class.getName());

  @Inject
  private BlobstoreService blobstoreService;

  @Inject
  private AttachmentEndpoint attachmentEndpoint;

  @Override
  public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    Map<String, List<BlobKey>> blobs = blobstoreService.getUploads(req);
    Map<String, String> ids = new LinkedHashMap<String, String>();
    for (Map.Entry<String, List<BlobKey>> entry : blobs.entrySet()) {
      List<BlobKey> blobKeys = entry.getValue();
      log.info("blobKeys: " + blobKeys);
      BlobKey blobKey = Iterables.getOnlyElement(blobKeys);
      Attachment attachment = new Attachment();
      attachment.setBlobKey(blobKey);
      attachmentEndpoint.insert(attachment);
      ids.put(entry.getKey(), attachment.getId());
    }
    resp.setContentType("application/json");
    resp.setHeader("Access-Control-Allow-Origin", "*");
    String json = new Gson().toJson(ids);
    resp.getWriter().print(json);
  }

  @Override
  protected void doOptions(HttpServletRequest arg0, HttpServletResponse resp)
      throws ServletException, IOException {
    resp.setHeader("Access-Control-Allow-Origin", "*");
    resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT");
    resp.setHeader("Access-Control-Allow-Headers", "Content-Length");
    super.doOptions(arg0, resp);
  }
}
