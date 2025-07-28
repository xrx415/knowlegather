
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhb3BmbWtxZm95YWJiZ2N2enRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNDA3NDYsImV4cCI6MjA2MjcxNjc0Nn0.WZBMnJVtHTKLiKPSsKbvKn43R0X8iHBcu2yOuZFTDhE


## Body (zapytanie)
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Cześć, jak mogę zarządzać kolekcjami?"
    }
  ],
  "context": "Testowanie asystenta AI"
}
```

## Odpowiedź (response)
```json
{
	"message": {
		"role": "assistant",
		"content": "Cześć! Aby zarządzać kolekcjami, możesz:\n\n1.  **Tworzyć nowe kolekcje:** Zazwyczaj w interfejsie użytkownika znajduje się przycisk \"Utwórz kolekcję\" lub podobny. Kliknij go i postępuj zgodnie z instrukcjami, aby nadać kolekcji nazwę i opcjonalnie dodać opis.\n2.  **Edytować istniejące kolekcje:** Znajdź kolekcję, którą chcesz edytować (np. na liście kolekcji). Powinna być dostępna opcja edycji (ikona ołówka, przycisk \"Edytuj\" itp.). Kliknij ją i zmień nazwę, opis lub inne właściwości kolekcji.\n3.  **Usuwać kolekcje:** Podobnie jak w przypadku edycji, znajdź kolekcję, którą chcesz usunąć. Powinna być dostępna opcja usunięcia (ikona kosza, przycisk \"Usuń\" itp.). Pamiętaj, że usunięcie kolekcji może być nieodwracalne i spowodować utratę zawartych w niej elementów, więc upewnij się, że to na pewno chcesz zrobić.\n4.  **Dodawać elementy do kolekcji:** Po utworzeniu kolekcji, możesz dodawać do niej elementy (dokumenty, strony, linki, itp.). Zazwyczaj odbywa się to poprzez przeciągnięcie elementu do kolekcji lub poprzez opcję \"Dodaj do kolekcji\" dostępną w menu elementu.\n5.  **Organizować kolekcje:** W niektórych systemach możesz organizować kolekcje w hierarchie (tworzyć podkolekcje) lub używać tagów, aby łatwiej je wyszukiwać i grupować.\n6.  **Udostępniać kolekcje:** Możesz udostępniać kolekcje innym użytkownikom lub grupom, nadając im odpowiednie uprawnienia (np. tylko do odczytu, edycji).\n\nAby dać Ci bardziej konkretną odpowiedź, potrzebuję więcej informacji o systemie, z którego korzystasz.  Czy możesz mi powiedzieć, jakiego narzędzia/systemu używasz do zarządzania kolekcjami?\n"
	}
}
```
< HTTP/2 200 
< date: Tue, 03 Jun 2025 16:46:13 GMT
< content-type: application/json
< cf-ray: 94a0aa359a98bbb4-WAW
< cf-cache-status: DYNAMIC
< access-control-allow-origin: *
< strict-transport-security: max-age=31536000; includeSubDomains; preload
< vary: Accept-Encoding
< access-control-allow-headers: Content-Type, Authorization
< access-control-allow-methods: GET, POST, OPTIONS
< sb-project-ref: uaopfmkqfoyabbgcvzte
< x-deno-execution-id: 9eaf9d9c-4602-496f-b84e-ddccf565016b
< x-sb-edge-region: eu-central-1
< x-served-by: supabase-edge-runtime
< server: cloudflare
< alt-svc: h3=":443"; ma=86400
---


