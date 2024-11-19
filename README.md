# animeni-uploader

## Jak używać: _(W skrócie)_

```bash
deno run --allow-all main.ts
```

## Format pliku *.csv

Plik posiada następującą strukturę nie zależnie od trybu pracy:

```csv
Nazwa Serii
nazwa odcinka(np. 1 lub krwawy księżyc),download_link,embeded_link1,embeded_link2,...
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

## P.S.

Przy używaniu skompilowanej wersji na **Windows 10/11** nie działa plik .env.
Należy użyć flag bądź podać hasło po uruchomieniu programu.
