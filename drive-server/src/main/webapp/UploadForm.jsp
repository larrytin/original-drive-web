<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<%@ page import="com.google.appengine.api.blobstore.BlobstoreServiceFactory"%>
<%@ page import="com.google.appengine.api.blobstore.BlobstoreService"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>Upload Attachment</title>
</head>
<body>
  <%
    BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
  %>
  <form action="<%=blobstoreService.createUploadUrl("/upload")%>" method="post"
    enctype="multipart/form-data">
    <input type="file" name="attachment"> <input type="submit" value="Submit">
  </form>
</body>
</html>