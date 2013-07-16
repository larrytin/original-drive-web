package com.goodow.drive.android.adapter;

import com.goodow.drive.android.R;
import java.util.List;
import android.app.Activity;
import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

public class MyArrayAdapter extends ArrayAdapter<String> {

  public MyArrayAdapter(Context context, int resource, int textViewResourceId, List<String> objects) {
    super(context, resource, textViewResourceId, objects);
  }

  @Override
  public View getView(int position, View convertView, ViewGroup parent) {
    View row = convertView;
    if (null == row) {
      row = ((Activity) this.getContext()).getLayoutInflater().inflate(R.layout.row_folderlist, parent, false);
    }

    String item = getItem(position);

    ImageView img_left = (ImageView) row.findViewById(R.id.leftImage);
    TextView listItem = (TextView) row.findViewById(R.id.listItem);
    // Button button = (Button) row.findViewById(R.id.listButton);
    // button.setTag(position);

    img_left.setImageResource(R.drawable.ic_type_folder);
    listItem.setText(item);

    return row;
  }

}
