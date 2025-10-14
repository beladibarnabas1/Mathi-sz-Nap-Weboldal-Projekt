        let score = 0;
        let q3Score = 0;
        let q2CorrectCount = 0;
        let q1CorrectCount = 0;

        // Drag and Drop 
        function allowDrop(ev) {
            ev.preventDefault();
        }

        function drag(ev) {
            const draggedElement = ev.target.closest('[draggable="true"]');
            if (draggedElement) {
                ev.dataTransfer.setData("text", draggedElement.id);
                draggedElement.classList.add('dragging');
                ev.dataTransfer.effectAllowed = 'move';
            }
        }

        function drop(ev) {
            ev.preventDefault();
            const data = ev.dataTransfer.getData("text");
            const draggedElement = document.getElementById(data);
            if (!draggedElement || !draggedElement.draggable) return;

            let itemToMove;
            const isFromInitial = draggedElement.classList.contains('drag-item');
            const targetDropzone = ev.currentTarget;

            // If dropping on the same dropzone, do nothing
            if (!isFromInitial && draggedElement.closest('.dropzone') === targetDropzone) {
                draggedElement.classList.remove('dragging');
                return;
            }

            if (isFromInitial) {
                // From initial area: Create new dropped-item with cloned img
                itemToMove = document.createElement('div');
                itemToMove.className = 'dropped-item';
                itemToMove.id = data; // Keep ID
                itemToMove.draggable = true;

                const originalImg = draggedElement.querySelector('img');
                if (originalImg) {
                    const imgClone = originalImg.cloneNode(true);
                    itemToMove.appendChild(imgClone);
                }

                // Remove original from initial container
                draggedElement.parentNode.removeChild(draggedElement);
            } else {
                // From another dropzone: Move the entire dropped-item
                itemToMove = draggedElement;
                // Remove from previous parent
                if (itemToMove.parentNode) {
                    itemToMove.parentNode.removeChild(itemToMove);
                }
            }

            // Add to new dropzone's dropped-items container
            const droppedContainer = targetDropzone.querySelector('.dropped-items');
            if (droppedContainer) {
                droppedContainer.appendChild(itemToMove);
            }

            // Remove dragging class
            itemToMove.classList.remove('dragging');

            // Ensure drag event is attached (for dropped-items)
            if (itemToMove.classList.contains('dropped-item') && !itemToMove.hasAttribute('data-drag-attached')) {
                itemToMove.addEventListener('dragstart', drag);
                itemToMove.setAttribute('data-drag-attached', 'true');
            }

            // Visual feedback (remove previous classes from all dropzones)
            document.querySelectorAll('.dropzone').forEach(dz => {
                dz.classList.remove('valid-drop', 'invalid-drop');
            });

            // Optional: Add temporary valid class to target
            targetDropzone.classList.add('valid-drop');
            setTimeout(() => targetDropzone.classList.remove('valid-drop'), 1000);
        }

        // Initialize drag events for initial items on DOM load
        document.addEventListener('DOMContentLoaded', function() {
            const initialItems = document.querySelectorAll('#initialDragContainer .drag-item');
            initialItems.forEach(item => {
                item.addEventListener('dragstart', drag);
            });
        });

        function submitQuiz() {
            score = 0;

            // 3. feladat
            const q3Answers = document.querySelectorAll('input[name="q1"]:checked');
            const correctQ3 = ['gumiabroncsok', 'uzemanyagszint', 'vilagitas'];
            const selectedQ3 = Array.from(q3Answers).map(cb => cb.value);
            let correctSel = 0;
            let incSel = 0;
            selectedQ3.forEach(s => {
                if (correctQ3.includes(s)) {
                    correctSel++;
                } else {
                    incSel++;
                }
            });
            q3Score = correctSel - incSel;
            q3Score = Math.max(0, Math.min(3, q3Score)); 
            score += q3Score;

            // 4. feladat
            const q4Selected = document.querySelector('input[name="q2"]:checked');
            let q4Score = 0;
            if (q4Selected && q4Selected.value === 'b') {
                q4Score = 1;
                score += 1;
            }

            // 2. feladat
            q2CorrectCount = 0;
            const items = ['permetezo', 'balazo', 'eke', 'vetogep'];
            const correctZones = {
                'vetogep': 'vetes',
                'permetezo': 'novenyvedelem',
                'eke': 'talajmuveles',
                'balazo': 'szalma'
            };

            items.forEach(itemId => {
                const item = document.getElementById(itemId);
                if (item && item.classList.contains('dropped-item')) { 
                    const parentDropzone = item.closest('.dropzone');
                    if (parentDropzone && parentDropzone.id === correctZones[itemId]) {
                        q2CorrectCount++;
                    }
                }
            });
            score += q2CorrectCount;

            // 1. feladat
            const step1 = document.getElementById('step1').value;
            const step2 = document.getElementById('step2').value;
            const step3 = document.getElementById('step3').value;
            let q1CorrectCount = 0;
            if (step1 === 'ov') q1CorrectCount++;
            if (step2 === 'kulcs') q1CorrectCount++;
            if (step3 === 'sebesseg') q1CorrectCount++;
            score += q1CorrectCount;

            // eredmeny
            const resultDiv = document.getElementById('result');
            const maxScore = 11;
            let resultClass = 'error';
            if (score === maxScore) {
                resultClass = 'success';
            } else if (score >= 8) {
                resultClass = 'success';
            } else if (score >= 5) {
                resultClass = 'partial';
            }
            resultDiv.innerHTML = `<div class="${resultClass}">Elért pontszám: ${score}/${maxScore}</div>`;
            resultDiv.innerHTML += `<p> 1. feladat (sorrend): ${q1CorrectCount}/3 | 2. feladat (behúzós): ${q2CorrectCount}/4 | 3. feladat (bepipálgatós): ${q3Score}/3 | 4. feladat (választós): ${q4Score}/1 </p>`;
            if (score === maxScore) {
                resultDiv.innerHTML += '<p>Kiváló! Sikeresen teljesítetted a gépészmérnöki kvízt!</p>';
            } else if (score >= 8) {
                resultDiv.innerHTML += '<p>Remek munka! Te egy igazi gépészprofi vagy.</p>';
            } else if (score >= 5) {
                resultDiv.innerHTML += '<p>Szép munka! Részleges kredit – tanulj tovább!</p>';
            } else {
                resultDiv.innerHTML += '<p>Ideje áttekinteni néhány alapot. Próbáld újra!</p>';
            }
        }
