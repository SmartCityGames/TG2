import os
import json
import cv2
from random import choices
import numpy as np

takenMaps = {}
possible_maps = [
    'aeroporto.png',
    'aguas-claras.png',
    'arniqueiras.png',
    'asa-norte.png',
    'asa-sul.png',
    'brasilia.png',
    'candangolandia.png',
    'ceilandia.png',
    'cemiterio.png',
    'cidade-estrutural.png',
    'cruzeiro.png',
    'guara.png',
    'lago-norte.png',
    'lago-sul.png',
    'nucleo.png',
    'park-way.png',
    'recanto.png',
    'riacho.png',
    'samambaia.png',
    'sol-nascente.png',
    'taguatinga.png',
    'varjao.png',
    'vicente-pires.png',
    'vila-planalto.png'
]
description = {
    'aeroporto.png': 'Aeroporto',
    'aguas-claras.png': 'Aguas Claras',
    'arniqueiras.png': 'Arniqueiras',
    'asa-norte.png': 'Asa Norte',
    'asa-sul.png': 'Asa Sul',
    'brasilia.png': 'Brasilia',
    'candangolandia.png': 'Candangolandia',
    'ceilandia.png': 'Ceilandia',
    'cemiterio.png': 'Cemiterio',
    'cidade-estrutural.png': 'Cidade Estrutural',
    'cruzeiro.png': 'Cruzeiro',
    'guara.png': 'Guara',
    'lago-norte.png': 'Lago Norte',
    'lago-sul.png': 'Lago Sul',
    'nucleo.png': 'Nucleo Bandeirante',
    'park-way.png': 'Park Way',
    'recanto.png': 'Recanto das Emas',
    'riacho.png': 'Riacho Fundo',
    'samambaia.png': 'Samambaia',
    'sol-nascente.png': 'Sol Nascente',
    'taguatinga.png': 'Taguatinga',
    'varjao.png': 'Varjao',
    'vicente-pires.png': 'Vicente Pires',
    'vila-planalto.png': 'Vila Planalto'
}
idx = 999
width = 227
height = 206
points = (width, height)


def chooseRandomMaps() -> list:
    return choices(possible_maps, k=4)


def load_imgs(path: str, maps: list) -> tuple:
    maps_choosed = ()
    imgs = []

    for _map in maps:
        img = cv2.imread(os.path.join(path, _map))
        img = cv2.resize(img, points, interpolation=cv2.INTER_LINEAR)
        if img is not None:
            maps_choosed += (_map,)
            imgs.append(img)
    if takenMaps.get(maps_choosed) is None:
        takenMaps[maps_choosed] = 1
        desc_list = list(map(lambda x: description[x], maps_choosed))
        desc_str = ' - '.join(desc_list)
        return np.array_split(imgs, 2), desc_str
    return ()


def concat_vh(list_2d):
    return cv2.vconcat([cv2.hconcat(list_h) for list_h in list_2d])


def writeMetaData(idx, desc):
    meta = {
        'name': 'map_' + str(idx),
        'description': desc,
        'image': f'{idx}.png',
        'attributes': [
                {
                    'rarity': 0.5
                }
        ]
    }
    with open(f'./nft-images/{idx}.json', 'w') as outfile:
        json.dump(meta, outfile)


name_idx = 0
while (idx > 0):
    imgs, desc = load_imgs('./mapas', chooseRandomMaps())
    if len(imgs) > 0:
        img = concat_vh(imgs)
        cv2.imwrite('./nft-images/' + str(name_idx) + '.png', img)
        writeMetaData(name_idx, desc)
        name_idx += 1
    idx -= 1
