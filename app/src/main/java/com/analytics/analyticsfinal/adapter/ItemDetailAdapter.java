package com.analytics.analyticsfinal.adapter;

import android.content.Context;
import android.view.*;
import android.widget.TextView;
import androidx.appcompat.app.AlertDialog;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.analytics.analyticsfinal.R;
import com.analytics.analyticsfinal.model.ItemDetail;
import com.analytics.analyticsfinal.utils.UserManager;
import com.analytics.analyticstracker.AnalyticsTracker;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ItemDetailAdapter extends RecyclerView.Adapter<ItemDetailAdapter.ItemViewHolder> {



    private final Context context;
    private final List<ItemDetail> items;

    private final String categoryName;
    private final String subcategoryName;

    public ItemDetailAdapter(Context context, List<ItemDetail> items, String categoryName, String subcategoryName) {
        this.context = context;
        this.items = items;
        this.categoryName = categoryName;
        this.subcategoryName = subcategoryName;
    }

    @NonNull
    @Override
    public ItemViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_detail, parent, false);
        return new ItemViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ItemViewHolder holder, int position) {
        ItemDetail item = items.get(position);
        holder.title.setText(item.getTitle());

        holder.itemView.setOnClickListener(v -> {
            String userId = UserManager.getUserId(context);
            Map<String,Object> props = new HashMap<>();
            props.put("category",categoryName);
            props.put("subcategory",subcategoryName);
            props.put("item", item.getTitle());

            AnalyticsTracker.trackEvent(userId, "click_item", props);

            new AlertDialog.Builder(context)
                    .setTitle(item.getTitle())
                    .setMessage(item.getDescription())
                    .setPositiveButton("סגור", null)
                    .show();
        });
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    static class ItemViewHolder extends RecyclerView.ViewHolder {
        TextView title;
        TextView description;

        public ItemViewHolder(@NonNull View itemView) {
            super(itemView);
            title = itemView.findViewById(R.id.itemTitle);  // display item title
        }
    }
}
