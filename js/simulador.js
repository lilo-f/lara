document.addEventListener('DOMContentLoaded', () => {
    const tattooUpload = document.getElementById('tattoo-upload');
    const tattooPlacementArea = document.getElementById('tattoo-placement-area');
    const bodyModel = document.getElementById('body-model');
    const skinToneOptions = document.querySelectorAll('.skin-tone-box');
    const preloadedTattoos = document.querySelectorAll('.preloaded-tattoo');

    let activeTattoo = null;
    let isDragging = false;
    let isResizing = false;
    let isRotating = false;
    let initialX, initialY;
    let initialWidth, initialHeight;
    let initialAngle;

    // Função para adicionar uma nova tatuagem à área de posicionamento
    function addTattoo(src) {
        const tattoo = document.createElement('img');
        tattoo.src = src;
        tattoo.classList.add('draggable-tattoo');
        tattoo.style.left = '50%';
        tattoo.style.top = '50%';
        tattoo.style.transform = 'translate(-50%, -50%)'; // Centraliza inicialmente
        tattooPlacementArea.appendChild(tattoo);
        makeTattooInteractive(tattoo);
        activeTattoo = tattoo;
    }

    // Lidar com o upload de tatuagens
    tattooUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'image/png') {
            const reader = new FileReader();
            reader.onload = (e) => {
                addTattoo(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            alert('Por favor, selecione um arquivo PNG com fundo transparente.');
        }
    });

    // Lidar com tatuagens predefinidas
    preloadedTattoos.forEach(preloaded => {
        preloaded.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('image/png', preloaded.src);
        });
    });

    tattooPlacementArea.addEventListener('dragover', (event) => {
        event.preventDefault(); // Permite o drop
    });

    tattooPlacementArea.addEventListener('drop', (event) => {
        event.preventDefault();
        const src = event.dataTransfer.getData('image/png');
        if (src) {
            const tattoo = document.createElement('img');
            tattoo.src = src;
            tattoo.classList.add('draggable-tattoo');
            // Posiciona a tatuagem onde o drop ocorreu
            const rect = tattooPlacementArea.getBoundingClientRect();
            tattoo.style.left = `${event.clientX - rect.left}px`;
            tattoo.style.top = `${event.clientY - rect.top}px`;
            tattoo.style.transform = 'translate(-50%, -50%)'; // Ajusta para o centro do mouse
            tattooPlacementArea.appendChild(tattoo);
            makeTattooInteractive(tattoo);
            activeTattoo = tattoo;
        }
    });


    // Tornar a tatuagem arrastável, redimensionável e rotacionável
    function makeTattooInteractive(tattoo) {
        // Remover handles antigos se existirem
        const oldHandles = tattoo.querySelectorAll('.resize-handle, .rotate-handle');
        oldHandles.forEach(handle => handle.remove());

        // Adicionar handle de redimensionamento
        const resizeHandle = document.createElement('div');
        resizeHandle.classList.add('resize-handle', 'bottom-right');
        tattoo.appendChild(resizeHandle);

        // Adicionar handle de rotação
        const rotateHandle = document.createElement('div');
        rotateHandle.classList.add('rotate-handle', 'top-center');
        tattoo.appendChild(rotateHandle);

        // Ativar tatuagem ao clicar
        tattoo.addEventListener('mousedown', (e) => {
            if (e.target === tattoo) { // Apenas se clicar na imagem da tatuagem, não nos handles
                activeTattoo = tattoo;
                isDragging = true;
                initialX = e.clientX - tattoo.getBoundingClientRect().left;
                initialY = e.clientY - tattoo.getBoundingClientRect().top;
                tattoo.classList.add('dragging');
            }
        });

        // Eventos de redimensionamento
        resizeHandle.addEventListener('mousedown', (e) => {
            e.stopPropagation(); // Impede o drag da tatuagem
            isResizing = true;
            initialX = e.clientX;
            initialY = e.clientY;
            initialWidth = tattoo.offsetWidth;
            initialHeight = tattoo.offsetHeight;
        });

        // Eventos de rotação
        rotateHandle.addEventListener('mousedown', (e) => {
            e.stopPropagation(); // Impede o drag da tatuagem
            isRotating = true;
            const rect = tattoo.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            initialAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
            const currentTransform = window.getComputedStyle(tattoo).transform;
            const match = currentTransform.match(/rotateZ\(([-.\d]+)deg\)/) || currentTransform.match(/rotate\(([-.\d]+)deg\)/);
            if (match) {
                initialAngle -= parseFloat(match[1]);
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging && activeTattoo) {
                const rect = tattooPlacementArea.getBoundingClientRect();
                let x = e.clientX - rect.left - initialX;
                let y = e.clientY - rect.top - initialY;

                activeTattoo.style.left = `${x}px`;
                activeTattoo.style.top = `${y}px`;
                activeTattoo.style.transform = 'none'; // Resetar transform para posicionamento absoluto
            } else if (isResizing && activeTattoo) {
                const dx = e.clientX - initialX;
                const dy = e.clientY - initialY;
                const newWidth = initialWidth + dx;
                const newHeight = initialHeight + dy;
                
                // Manter proporção (opcional, pode ser removido se quiser distorcer)
                const aspectRatio = initialWidth / initialHeight;
                if (newWidth / newHeight > aspectRatio) {
                    activeTattoo.style.width = `${newWidth}px`;
                    activeTattoo.style.height = `${newWidth / aspectRatio}px`;
                } else {
                    activeTattoo.style.height = `${newHeight}px`;
                    activeTattoo.style.width = `${newHeight * aspectRatio}px`;
                }
            } else if (isRotating && activeTattoo) {
                const rect = activeTattoo.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
                const rotation = currentAngle - initialAngle;
                activeTattoo.style.transform = `rotate(${rotation}deg)`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            isResizing = false;
            isRotating = false;
            if (activeTattoo) {
                activeTattoo.classList.remove('dragging');
            }
        });

        // Adicionar interatividade para dispositivos touch
        tattoo.addEventListener('touchstart', (e) => {
            if (e.target === tattoo) {
                activeTattoo = tattoo;
                isDragging = true;
                const touch = e.touches[0];
                initialX = touch.clientX - tattoo.getBoundingClientRect().left;
                initialY = touch.clientY - tattoo.getBoundingClientRect().top;
                tattoo.classList.add('dragging');
                e.preventDefault(); // Previne o scroll padrão da página
            }
        }, { passive: false });

        resizeHandle.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            isResizing = true;
            const touch = e.touches[0];
            initialX = touch.clientX;
            initialY = touch.clientY;
            initialWidth = activeTattoo.offsetWidth;
            initialHeight = activeTattoo.offsetHeight;
            e.preventDefault();
        }, { passive: false });

        rotateHandle.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            isRotating = true;
            const touch = e.touches[0];
            const rect = activeTattoo.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            initialAngle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * (180 / Math.PI);
            const currentTransform = window.getComputedStyle(activeTattoo).transform;
            const match = currentTransform.match(/rotateZ\(([-.\d]+)deg\)/) || currentTransform.match(/rotate\(([-.\d]+)deg\)/);
            if (match) {
                initialAngle -= parseFloat(match[1]);
            }
            e.preventDefault();
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) { // Apenas um toque para arrastar, redimensionar, girar
                if (isDragging && activeTattoo) {
                    const touch = e.touches[0];
                    const rect = tattooPlacementArea.getBoundingClientRect();
                    let x = touch.clientX - rect.left - initialX;
                    let y = touch.clientY - rect.top - initialY;
                    activeTattoo.style.left = `${x}px`;
                    activeTattoo.style.top = `${y}px`;
                    activeTattoo.style.transform = 'none';
                    e.preventDefault();
                } else if (isResizing && activeTattoo) {
                    const touch = e.touches[0];
                    const dx = touch.clientX - initialX;
                    const dy = touch.clientY - initialY;
                    const newWidth = initialWidth + dx;
                    const newHeight = initialHeight + dy;

                    const aspectRatio = initialWidth / initialHeight;
                    if (newWidth / newHeight > aspectRatio) {
                        activeTattoo.style.width = `${newWidth}px`;
                        activeTattoo.style.height = `${newWidth / aspectRatio}px`;
                    } else {
                        activeTattoo.style.height = `${newHeight}px`;
                        activeTattoo.style.width = `${newHeight * aspectRatio}px`;
                    }
                    e.preventDefault();
                } else if (isRotating && activeTattoo) {
                    const touch = e.touches[0];
                    const rect = activeTattoo.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    const currentAngle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * (180 / Math.PI);
                    const rotation = currentAngle - initialAngle;
                    activeTattoo.style.transform = `rotate(${rotation}deg)`;
                    e.preventDefault();
                }
            }
        }, { passive: false });

        document.addEventListener('touchend', () => {
            isDragging = false;
            isResizing = false;
            isRotating = false;
            if (activeTattoo) {
                activeTattoo.classList.remove('dragging');
            }
        });
    }

    // Lidar com a mudança do tom de pele
    skinToneOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remover seleção anterior
            skinToneOptions.forEach(opt => opt.classList.remove('selected'));
            // Adicionar seleção ao clicado
            option.classList.add('selected');

            const tone = option.dataset.tone;
            // Remover classes de tom de pele existentes e adicionar a nova
            bodyModel.classList.remove('light', 'medium', 'dark');
            bodyModel.classList.add(tone);

            // Trocar imagem do modelo de corpo com base no tom de pele
            // Certifique-se de ter imagens nomeadas adequadamente (ex: male_body_light.png, male_body_medium.png, male_body_dark.png)
            bodyModel.src = `https://i.imgur.com/male_body_${tone}.png`; // Ajuste o caminho das suas imagens de corpo
        });
    });

    // Selecionar o tom de pele inicial como 'light'
    document.querySelector('.skin-tone-box[data-tone="light"]').click();
});