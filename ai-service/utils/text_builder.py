def build_item_text(item):
    parts = [
        item.get("title", ""),
        item.get("description", ""),
        item.get("category", ""),
        item.get("brand", ""),
        item.get("color", ""),
        item.get("location", ""),
    ]

    return " ".join(str(part) for part in parts if part).strip()