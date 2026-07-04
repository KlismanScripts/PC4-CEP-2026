/* Muestra el panel del problema elegido y activa su botón */
async function loadProblem(id, hacerScroll = true) {
  /* desactivar todos los botones */
  document.querySelectorAll('.prob-btn').forEach(b => b.classList.remove('active'));
  
  /* activar el botón que tiene onclick="show('id')" (ahora loadProblem) */
  document.getElementById(`btn-${id}`).classList.add('active');

  /* ocultar todos los paneles - ahora se hace con opacidad */
  const contenedor = document.getElementById('contenedor-dinamico');
  contenedor.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
  contenedor.style.opacity = '0';
  contenedor.style.transform = 'translateY(10px)';

  try {
    const response = await fetch(`preguntas/${id}/${id}.html`);
    if (!response.ok) throw new Error('Error al cargar');
    
    const html = await response.text();
    
    setTimeout(() => {
      /* mostrar el panel elegido (inyectando HTML dinámico) */
      contenedor.innerHTML = html;
      
      /* scroll al inicio del contenido SOLO si se hizo clic en el botón */
      if (hacerScroll) {
        document.querySelector('.content').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      
      contenedor.style.opacity = '1';
      contenedor.style.transform = 'translateY(0)';
    }, 200);
    
  } catch (error) {
    console.error("Error:", error);
    setTimeout(() => {
      contenedor.innerHTML = `<p style="color: var(--gold); font-weight: bold; text-align: center; padding: 40px;">Error al cargar preguntas/${id}/${id}.html</p>`;
      contenedor.style.opacity = '1';
      contenedor.style.transform = 'translateY(0)';
    }, 200);
  }
}

/* Cargar la pregunta 1 por defecto SIN hacer scroll hacia abajo al abrir la página */
document.addEventListener('DOMContentLoaded', () => {
  loadProblem('p1', false);
});

/* Lightbox */
/* =======================================================
   LIGHTBOX (Mejorado para Código)
   ======================================================= */
function lbOpen(cell) {
  const img = cell.querySelector('img');
  const cap = cell.querySelector('.img-cap');
  const hiddenCode = cell.querySelector('.hidden-code'); // Busca si hay código oculto

  const lbImg = document.getElementById('lb-img');
  const lbCodeContainer = document.getElementById('lb-code-container');
  const lbCode = document.getElementById('lb-code');

  // Ocultamos ambos por defecto
  lbImg.style.display = 'none';
  lbCodeContainer.style.display = 'none';

  if (hiddenCode) {
    // Si hay código oculto, mostramos el editor de texto
    lbCode.textContent = hiddenCode.textContent.trim();
    lbCodeContainer.style.display = 'block';
  } else if (img) {
    // Si no hay código, mostramos la imagen normal
    lbImg.src = img.src;
    lbImg.style.display = 'block';
  }

  // Ponemos el caption
  document.getElementById('lb-cap').textContent = cap ? cap.textContent : (img ? img.alt : '');
  document.getElementById('lb').classList.add('open');
}

function lbClose() {
  document.getElementById('lb').classList.remove('open');
  document.getElementById('lb-img').src = '';
  document.getElementById('lb-code').textContent = '';
  document.getElementById('btn-copy').textContent = 'Copiar Código'; // Reinicia el botón
}

function copyCode() {
  const codeText = document.getElementById('lb-code').textContent;
  navigator.clipboard.writeText(codeText).then(() => {
    const btn = document.getElementById('btn-copy');
    btn.textContent = '¡Copiado!'; // Da feedback visual
  });
}

document.getElementById('lb').addEventListener('click', e => { 
  if (e.target === document.getElementById('lb')) lbClose(); 
});
document.addEventListener('keydown', e => { 
  if (e.key === 'Escape') lbClose(); 
});