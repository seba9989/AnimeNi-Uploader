# animeni-uploader

## Jak używać: _(W skrócie)_

```bash
bun run main.ts
```

## Format pliku *.csv

Plik posiada następującą strukturę nie zależnie od trybu pracy:

```csv
Nazwa Serii
nazwa odcinka(np. 1 lub krwawy księżyc),download_link,embeded_link1,embeded_link2,...
```

```csv
Bleach
75,https://filemoon.sx/d/zwszmfmhn2me/Bleach_00075_Lektor_PL___Wideo,https://filemoon.sx/e/zwszmfmhn2me/Bleach_00075_Lektor_PL___Wideo
```

## Flagi trybu:

- `--add_embeds` - tryb dodający nowe _embeds_ do istniejących odcinków.
- `--add_episodes` - tryb dodający nowe odcinki do istniejącej serii.

## Dodatkowe flagi:

- `--csv=ścieżka/do/pliku` - pozwala na ustawienie ścieżki do pliku bez potrzeby
  ponownego podawania.
- `--login=twójLogin` - pozwala na ustawienie loginu bez potrzeby ponownego
  podawania.
- `--password=twojeHasło` - pozwala na ustawienie hasła bez potrzeby ponownego
  podawania.
