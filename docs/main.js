if (navigator.clipboard) {
  for (const copyButton of document.querySelectorAll("[data-copy]")) {
    const command = document.getElementById(copyButton.dataset.copy);
    const status = copyButton.parentElement.querySelector(".copy-status");
    copyButton.hidden = false;

    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(command.textContent);
        status.textContent = "Commande copiée.";
      } catch {
        status.textContent = "Sélectionne la commande pour la copier.";
      }
    });
  }
}
