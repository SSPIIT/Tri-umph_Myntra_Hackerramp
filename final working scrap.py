import csv
from collections import defaultdict

def calculate_matching_words(search_terms, text):
    # Calculate number of matching words between search_terms and text
    search_terms_set = set(search_terms.lower().split())
    text_set = set(text.lower().split())
    return len(search_terms_set.intersection(text_set))

def search_links(csv_file, search_terms):
    results = defaultdict(list)
    with open(csv_file, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            for column in ['actual_color', 'dominant_color', 'specifications', 'body', 'size_fit','title']:
                if row[column]:
                    matching_words = calculate_matching_words(search_terms, row[column])
                    results[row['uniq_id']].append((matching_words, row['link']))
    
    # Sort results by maximum matching words and get top 3 products
    sorted_results = sorted(results.items(), key=lambda x: max(x[1], key=lambda y: y[0], default=(0, ''))[0], reverse=True)[:3]
    
    # Extract links for top 3 products
    top_links = []
    for uniq_id, links in sorted_results:
        max_matching_words, link = max(links, key=lambda x: x[0], default=(0, ''))
        top_links.append(link)
    
    return top_links

# Example usage:
if __name__ == "__main__":
    csv_file = 'myntra_products.csv'  # Replace with your CSV file path
    user_input = input("Enter your search term: ")
    links = search_links(csv_file, user_input)
    if links:
        print(f"Top 3 links related to '{user_input}':")
        for idx, link in enumerate(links, 1):
            print(f"{idx}. {link}")
    else:
        print(f"No links found related to '{user_input}'.")
