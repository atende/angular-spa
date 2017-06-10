import { Directive, Input, TemplateRef, ViewContainerRef, ElementRef } from '@angular/core'
import { AuthService } from '../auth.service'
import { RoleDirective, RoleContext } from './interfaces'
import { DomService } from '../dom/dom.service'

@Directive({ selector: '[secHasAllRoles]' })
export class HasAllRoles extends RoleDirective {
    @Input('secHasAllRoles') _roles: string
    @Input('resource') _resource: string

    constructor(
        protected element: ViewContainerRef,
        protected domService: DomService,
        protected auth: AuthService,
        templateRef: TemplateRef<RoleContext>

    ) {
        super(element, domService, templateRef)
    }

    ngOnInit() {
        this.applyDirective()
    }

    roleFunction = (roles: string[], resource?: string) => {
        for (let role of roles) {
            if (!this.auth.hasRole(role, resource)) {
                return false
            }
        }
        return true
    }
}
